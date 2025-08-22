import os
# Stripe Ingestion Endpoint
import stripe

import json
import sqlite3
import hashlib
import hmac
import requests
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse, HTMLResponse
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv()

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
if STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY

# Dashboard token (optional). If set, dashboard routes and totals endpoints require Authorization: Bearer <token>
DASHBOARD_TOKEN = os.getenv('DASHBOARD_TOKEN')

# create app early so route decorators can be applied
app = FastAPI(title="Liquidity Receiver", version="1.0.0")

# CORS - adjust origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount dashboard static folder and require token helper
static_path = os.path.join(os.path.dirname(__file__), 'dashboard')
if os.path.isdir(static_path):
    app.mount('/static', StaticFiles(directory=static_path), name='static')


def require_dashboard_token(request: Request):
    if not DASHBOARD_TOKEN:
        return True
    auth = request.headers.get('authorization') or request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        raise HTTPException(status_code=403, detail='Missing Authorization')
    token = auth.split(' ',1)[1].strip()
    if token != DASHBOARD_TOKEN:
        raise HTTPException(status_code=403, detail='Invalid token')
    return True

def fetch_stripe_charges():
    # Fetch all charges (can be filtered by created, limit, etc.)
    charges = []
    try:
        for charge in stripe.Charge.auto_paging_iter(limit=100):
            charges.append(charge)
    except Exception as e:
        raise RuntimeError(f"Stripe API error (charges): {e}")
    return charges

def fetch_stripe_payouts():
    payouts = []
    try:
        for payout in stripe.Payout.auto_paging_iter(limit=100):
            payouts.append(payout)
    except Exception as e:
        raise RuntimeError(f"Stripe API error (payouts): {e}")
    return payouts

@app.post("/stripe/sync")
async def stripe_sync():
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=400, detail="Missing STRIPE_API_KEY in .env")
    inserted = 0
    anomalies = []
    # Ingest charges
    charges = fetch_stripe_charges()
    for charge in charges:
        try:
            event_id = str(charge["id"])
            source_id = str(charge.get("balance_transaction") or event_id)
            amount_cents = int(charge["amount"])
            currency = str(charge["currency"]).upper()
            occurred_at = datetime.fromtimestamp(charge["created"], tz=timezone.utc).isoformat()
            audit_payload = dict(charge)
            # Only ingest succeeded, paid, not refunded
            if charge["paid"] and charge["status"] == "succeeded" and not charge.get("refunded", False):
                # FX conversion if not USD
                try:
                    fx_rate = get_fx_rate(occurred_at[:10], currency, "USD")
                    amount_usd = (Decimal(amount_cents) / 100 * fx_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                    amount_cents_usd = int((amount_usd * 100).to_integral_value(rounding=ROUND_HALF_UP))
                    fx_info = {
                        "original_amount_cents": amount_cents,
                        "original_currency": currency,
                        "fx_rate": str(fx_rate),
                        "converted_usd": str(amount_usd),
                        "conversion_date": occurred_at[:10],
                    }
                except Exception as fx_err:
                    fx_info = {
                        "original_amount_cents": amount_cents,
                        "original_currency": currency,
                        "fx_error": str(fx_err),
                        "conversion_date": occurred_at[:10],
                    }
                    amount_cents_usd = 0
                    anomalies.append({"event_id": event_id, "error": str(fx_err)})
                audit_payload["fx_conversion"] = fx_info
                if amount_cents_usd > 0:
                    insert_earning("stripe", event_id, amount_cents_usd, "USD", source_id, occurred_at, audit_payload)
                    inserted += 1
        except Exception as e:
            anomalies.append({"event_id": charge.get("id"), "error": str(e)})
    # Optionally, ingest payouts (not included in totals, but can be logged)
    # payouts = fetch_stripe_payouts()
    # for payout in payouts:
    #     ...
    # Seal epoch
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='stripe' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    with open(DB_PATH, "rb") as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"stripe|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()
    return {"status": "ok", "inserted": inserted, "anomalies": anomalies, "sealed_hash": seal}

DB_PATH = "earnings.sqlite"
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS earnings(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  source_id TEXT,
  occurred_at TEXT NOT NULL,
  payload_json TEXT NOT NULL
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_provider_time ON earnings(provider, occurred_at);")
conn.commit()

app = FastAPI(title="Liquidity Receiver", version="1.0.0")

# CORS - adjust origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FX conversion cache
FX_CACHE = {}
OPENEXCHANGERATES_APP_ID = os.getenv("OPENEXCHANGERATES_APP_ID")
FX_BASE_URL = "https://openexchangerates.org/api/"

def get_fx_rate(date_str, from_ccy, to_ccy="USD"):
    """Fetch and cache daily close FX rate from OpenExchangeRates."""
    if from_ccy.upper() == to_ccy.upper():
        return Decimal("1.0")
    key = f"{date_str}|{from_ccy.upper()}|{to_ccy.upper()}"
    if key in FX_CACHE:
        return FX_CACHE[key]
    if not OPENEXCHANGERATES_APP_ID:
        raise RuntimeError("Missing OPENEXCHANGERATES_APP_ID in .env for FX conversion.")
    url = f"{FX_BASE_URL}historical/{date_str}.json"
    params = {"app_id": OPENEXCHANGERATES_APP_ID, "base": from_ccy.upper()}
    resp = requests.get(url, params=params, timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"FX API error: {resp.text}")
    data = resp.json()
    rates = data.get("rates", {})
    rate = rates.get(to_ccy.upper())
    if not rate:
        raise RuntimeError(f"Missing FX rate for {from_ccy}->{to_ccy} on {date_str}")
    FX_CACHE[key] = Decimal(str(rate))
    return FX_CACHE[key]

def insert_earning(provider: str, event_id: str, amount_cents: int, currency: str, source_id: str, occurred_at_iso: str, payload: dict):
    cur.execute("""
      INSERT OR IGNORE INTO earnings(provider, event_id, amount_cents, currency, source_id, occurred_at, payload_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (provider, event_id, amount_cents, currency.upper(), source_id, occurred_at_iso, json.dumps(payload, separators=(",", ":"))))
    conn.commit()


def cents_from_decimal_str(value_str: str) -> int:
    parts = str(value_str).split('.')
    if len(parts) == 1:
        return int(parts[0]) * 100
    whole, frac = parts[0], parts[1]
    frac = (frac + '00')[:2]
    return int(whole) * 100 + int(frac)


GUMROAD_SIGNING_SECRET = os.getenv('GUMROAD_SIGNING_SECRET')

def gumroad_verify_signature(raw_body: bytes, provided_sig: str) -> bool:
    if not (GUMROAD_SIGNING_SECRET and provided_sig):
        return False
    mac = hmac.new(GUMROAD_SIGNING_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    return mac.lower() == provided_sig.lower()


@app.post('/gumroad/webhook')
async def gumroad_webhook(request: Request, x_gumroad_signature: str | None = None):
    raw = await request.body()
    # Verify HMAC
    if not gumroad_verify_signature(raw, x_gumroad_signature or ''):
        raise HTTPException(status_code=400, detail='Gumroad signature verification failed')

    content_type = request.headers.get('content-type', '')
    data = {}
    if 'application/json' in content_type:
        try:
            data = json.loads(raw.decode('utf-8'))
        except Exception:
            raise HTTPException(status_code=400, detail='Invalid JSON')
    else:
        # form-encoded
        form = await request.form()
        data = {k: v for k, v in form.items()}

    anomalies = []

    event_id = str(data.get('id') or data.get('sale_id') or f"gumroad-{int(datetime.now(timezone.utc).timestamp()*1000)}")
    currency = str(data.get('currency') or 'USD').upper()

    # Gumroad typically sends price in cents as 'price' or 'price_cents'
    price_cents = data.get('price_cents') or data.get('price') or data.get('price_usd') or data.get('amount')
    try:
        amount_cents = int(price_cents)
    except Exception:
        # fallback to decimal string
        amount_cents = cents_from_decimal_str(str(data.get('amount') or '0'))

    occurred_at = str(data.get('created_at') or data.get('sale_timestamp') or datetime.now(timezone.utc).isoformat())
    source_id = str(data.get('purchase_id') or data.get('order_id') or data.get('product_id') or event_id)

    # Extended logging fields
    product_name = data.get('product_name') or data.get('product_title') or ''
    license_key = data.get('license_key') or data.get('license') or ''
    purchaser_email = data.get('buyer_email') or data.get('purchaser_email') or ''
    purchaser_email_hash = hashlib.sha256(purchaser_email.encode()).hexdigest() if purchaser_email else ''
    purchaser_email_redacted = ''
    if purchaser_email and '@' in purchaser_email:
        local, domain = purchaser_email.split('@', 1)
        purchaser_email_redacted = local[:1] + '***@' + domain
    elif purchaser_email:
        purchaser_email_redacted = 'redacted'

    audit_payload = dict(data)
    audit_payload['raw_body'] = raw.decode('utf-8', errors='ignore')
    audit_payload['product_name'] = product_name
    audit_payload['license_key'] = license_key
    audit_payload['buyer_email_redacted'] = purchaser_email_redacted
    audit_payload['buyer_email_hash'] = purchaser_email_hash

    # FX normalization: convert to USD before insert if needed
    amount_cents_to_store = 0
    currency_to_store = currency
    try:
        if currency.upper() != 'USD':
            amount_decimal = Decimal(amount_cents) / Decimal(100)
            fx_rate = get_fx_rate(occurred_at[:10], currency, 'USD')
            amount_usd = (amount_decimal * fx_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            amount_cents_usd = int((amount_usd * 100).to_integral_value(rounding=ROUND_HALF_UP))
            amount_cents_to_store = amount_cents_usd
            currency_to_store = 'USD'
            audit_payload['fx_conversion'] = {
                'original_amount_cents': amount_cents,
                'original_currency': currency,
                'fx_rate': str(fx_rate),
                'converted_usd_cents': amount_cents_usd,
                'conversion_date': occurred_at[:10],
            }
        else:
            amount_cents_to_store = int(amount_cents)
            currency_to_store = 'USD'
    except Exception as fx_err:
        anomalies.append({'event_id': event_id, 'error': f'FX error: {str(fx_err)}'})
        amount_cents_to_store = 0

    inserted = 0
    if amount_cents_to_store > 0:
        insert_earning('gumroad', event_id, amount_cents_to_store, currency_to_store, source_id, occurred_at, audit_payload)
        inserted = 1

    # Seal epoch for Gumroad after insert
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='gumroad' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    with open(DB_PATH, 'rb') as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"gumroad|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()

    return JSONResponse({'status': 'ok', 'inserted': inserted, 'anomalies': anomalies, 'sealed_hash': seal})


@app.get('/totals/gumroad')
def totals_gumroad(dep=Depends(require_dashboard_token)):
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='gumroad' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    total_formatted = f"${sum_usd_cents/100:,.2f}"
    with open(DB_PATH, 'rb') as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"gumroad|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()
    return {'provider': 'gumroad', 'currency': 'USD', 'total_cents': sum_usd_cents, 'total_formatted': total_formatted, 'rows': rows, 'sealed_hash': seal}

@app.post("/upwork/sync")
async def upwork_sync(request: Request):
    payload = await request.json()
    report = payload.get("report", {})
    entries = report.get("entries", [])
    inserted = 0
    anomalies = []
    for entry in entries:
        try:
            event_id = str(entry.get("id"))
            source_id = str(entry.get("contract", {}).get("id", event_id))
            amount_str = str(entry.get("amount", "0"))
            currency = str(entry.get("currency", "USD")).upper()
            occurred_at = str(entry.get("date"))
            description = entry.get("description", "")
            client_country = entry.get("client", {}).get("country", "")

            # FX conversion
            try:
                fx_rate = get_fx_rate(occurred_at, currency, "USD")
                amount_usd = (Decimal(amount_str) * fx_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                amount_cents = int((amount_usd * 100).to_integral_value(rounding=ROUND_HALF_UP))
                fx_info = {
                    "original_amount": amount_str,
                    "original_currency": currency,
                    "fx_rate": str(fx_rate),
                    "converted_usd": str(amount_usd),
                    "conversion_date": occurred_at,
                }
            except Exception as fx_err:
                fx_info = {
                    "original_amount": amount_str,
                    "original_currency": currency,
                    "fx_error": str(fx_err),
                    "conversion_date": occurred_at,
                }
                amount_cents = 0
                anomalies.append({"event_id": event_id, "error": str(fx_err)})

            audit_payload = dict(entry)
            audit_payload["fx_conversion"] = fx_info
            audit_payload["description"] = description
            audit_payload["client_country"] = client_country

            if amount_cents > 0:
                insert_earning("upwork", event_id, amount_cents, "USD", source_id, occurred_at, audit_payload)
                inserted += 1
        except Exception as e:
            anomalies.append({"event_id": entry.get("id"), "error": str(e)})

    # Seal epoch
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='upwork' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    with open(DB_PATH, "rb") as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"upwork|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()
    return {"status": "ok", "inserted": inserted, "anomalies": anomalies, "sealed_hash": seal}

@app.get("/totals/upwork")
def totals_upwork(dep=Depends(require_dashboard_token)):
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='upwork' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    total_formatted = f"${sum_usd_cents/100:,.2f}"
    with open(DB_PATH, "rb") as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"upwork|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()
    return {"provider": "upwork", "currency": "USD", "total_cents": sum_usd_cents, "total_formatted": total_formatted, "rows": rows, "sealed_hash": seal}


@app.get("/totals/stripe")
def totals_stripe():
    cur.execute("SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider='stripe' AND currency='USD'")
    sum_usd_cents, rows = cur.fetchone()
    total_formatted = f"${sum_usd_cents/100:,.2f}"
    with open(DB_PATH, "rb") as f:
        db_bytes = f.read()
    seal = hashlib.sha256(
        f"stripe|USD|{sum_usd_cents}|{rows}|".encode() + hashlib.sha256(db_bytes).digest()
    ).hexdigest()
    return {"source": "stripe", "currency": "USD", "total_usd": f"{sum_usd_cents/100:.2f}", "total_formatted": total_formatted, "rows": rows, "sealed_hash": seal}
