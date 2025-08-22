Mesh Codex — AlphaFund Liquidity Mesh (2025)

Purpose
-------
This codex documents the sovereign ingestion mesh we built in 2025: endpoints, contracts, database schema, sealing and verification rituals, FX conversion rules, and operational checks. Use this as the single reference when extending the mesh or auditing past epochs.

Quick plan (what I will provide)
- A concise checklist of endpoints and responsibilities.
- Exact input/output contracts for each public endpoint.
- DB schema and idempotency rules.
- Sealing algorithm and verification ritual.
- FX conversion policy and caching behavior.
- Security checklist and required env vars.
- How to extend (recipes for Gumroad / PayPal / Prometheus export).

Checklist
---------
- [x] `/upwork/sync` — POST ingestion endpoint (idempotent)
- [x] `/stripe/sync` — POST ingestion endpoint (Stripe pulls)
- [x] `/totals/{provider}` — GET totals + sealed hash
- [x] `insert_earning()` — idempotent writer
- [x] SQLite ledger `earnings.sqlite`
- [x] FX conversion via OpenExchangeRates (daily historical rates)
- [x] CORS middleware to allow dashboard origins

API Contracts
-------------
1) POST /upwork/sync
- Input: JSON body { "report": { "entries": [ { /* entry shape */ } ] } }
- Expected per-entry keys (required): `id`, `date`, `amount`, `currency`.
- Behavior: parse each entry, compute amount_cents (Decimal -> cents), convert to USD via daily FX if currency != USD, call insert_earning(provider="upwork", event_id, amount_cents_usd, "USD", source_id, occurred_at, audit_payload).
- Output: { status: "ok", inserted: <int>, anomalies: [..], sealed_hash: <hex> }

2) POST /stripe/sync
- Input: none required (server pulls via Stripe API using STRIPE_API_KEY) or you can adapt to accept webhook payloads.
- Behavior: iterate charges; only ingest if paid && status == "succeeded" && not refunded. Use charge["id"] as event_id and charge["amount"] (cents) as source amount. Convert to USD if necessary.
- Output: { status: "ok", inserted: <int>, anomalies: [..], sealed_hash: <hex> }

3) POST /gumroad/webhook (recommended stub)
- Input: form-encoded or JSON body plus header `X-Gumroad-Signature` (HMAC-SHA256).
- Behavior: verify signature (HMAC using GUMROAD_SIGNING_SECRET on raw body), extract `id`, `price_cents` or `price`, insert via insert_earning("gumroad", ...).
- Output: { status: "ok" }

4) GET /totals/{provider}
- Input: provider path param (e.g., upwork, stripe, gumroad)
- Behavior: SQL: SELECT COALESCE(SUM(amount_cents),0), COUNT(*) FROM earnings WHERE provider=? AND currency='USD'
- Output: {
    provider: <string>,
    currency: "USD",
    total_cents: <int>,
    total_formatted: "$x.xx",
    rows: <int>,
    sealed_hash: <hex>
  }

Database Schema
---------------
Table: earnings
- id INTEGER PRIMARY KEY AUTOINCREMENT
- provider TEXT NOT NULL
- event_id TEXT NOT NULL UNIQUE
- amount_cents INTEGER NOT NULL
- currency TEXT NOT NULL
- source_id TEXT
- occurred_at TEXT NOT NULL (ISO 8601)
- payload_json TEXT NOT NULL (compact JSON for audit)

Indexes
- idx_provider_time ON (provider, occurred_at)

Idempotency
- INSERT OR IGNORE on event_id ensures repeated webhook deliveries do not double-count.

Sealing Algorithm
-----------------
Purpose: bind totals to the DB snapshot so an epoch can be independently audited.

Procedure (per-provider seal):
1. Compute sum_cents and row_count for provider and currency='USD'.
2. Read DB file bytes: db_bytes = open(DB_PATH, 'rb').read()
3. Compute db_sha = SHA256(db_bytes)
4. Compute seal_input = f"{provider}|{currency}|{sum_cents}|{row_count}|".encode() + db_sha
5. sealed_hash = SHA256(seal_input).hexdigest()
6. Return sealed_hash with totals endpoint. Persist sealed_hash+timestamp in your epoch book if desired.

Notes:
- Because seal includes DB snapshot hash, any modification to the DB changes db_sha and invalidates previous seals.
- Seal is ideally recorded in a committed artifact (e.g., git commit message or Book of Earnings file) to prove the epoch at time T.

FX Conversion Policy
--------------------
- Use OpenExchangeRates (or equivalent) historical endpoint: /api/historical/YYYY-MM-DD.json.
- Use the `from` currency as base when requesting rates (some APIs require base=USD; adapt per provider). The code caches rates per (date, from_ccy, to_ccy) with in-process dictionary.
- Conversion steps:
  - amount_decimal = Decimal(amount_str)
  - fx_rate = get_fx_rate(date, from_ccy, 'USD')
  - amount_usd = (amount_decimal * fx_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
  - amount_cents = int((amount_usd * 100).to_integral_value(rounding=ROUND_HALF_UP))
- Cache: FX_CACHE keyed by "YYYY-MM-DD|FROM|TO". Cache persists during process lifetime; restart clears it.
- Anomalies: if a rate is missing, log anomaly, set amount_cents=0 (do not insert) and surface the anomaly in /sync output for manual review.

Security & Env Vars
-------------------
Required env vars (examples):
- STRIPE_API_KEY or STRIPE_SECRET_KEY
- OPENEXCHANGERATES_APP_ID
- GUMROAD_SIGNING_SECRET
- PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID
- UPWORK_BEARER_TOKEN, UPWORK_EARNINGS_URL

Best practices
- Never commit `.env` or real keys. Keep `.env` in `.gitignore`.
- For webhooks, verify authenticity (HMAC for Gumroad, Stripe signature verification when using webhook forwarding or the Stripe SDK, PayPal webhook verify API).
- Rotate keys if compromised and re-seal affected epochs after remediation.

Operational Routines
--------------------
1. Verification pass (recommended):
   - Run backend: `uvicorn main:app --reload --port 8000`
   - Serve dashboard: `python -m http.server 8080` from `dashboard/`
   - POST sample payloads to `/upwork/sync` and `/gumroad/webhook` (if implemented).
   - GET `/totals/*` and confirm totals + sealed_hash change as expected.

2. Seal & Record:
   - For each epoch (daily or after significant ingestion), record: provider, currency, total_cents, rows, sealed_hash, timestamp.
   - Optionally commit a small `book-of-earnings/YYYY-MM-DD.json` with that data or push sealed_hash to an external ledger.

3. Audit:
   - To verify a seal later: recompute db SHA on the persisted DB snapshot, recompute sealed_hash using the same inputs and compare.

Extension Recipes
-----------------
Gumroad (HMAC) quick recipe:
- Add `GUMROAD_SIGNING_SECRET` to .env.
- Endpoint `/gumroad/webhook`:
  - raw = await request.body(); sig = request.headers.get('X-Gumroad-Signature')
  - mac = HMAC_SHA256(secret, raw).hexdigest(); compare lower()-case
  - Parse form or json, extract id and price_cents
  - insert_earning('gumroad', event_id, amount_cents, currency, source_id, occurred_at, payload)

PayPal quick recipe:
- Use OAuth client credentials to call `/v1/notifications/verify-webhook-signature` per PayPal docs.
- Validate the webhook, then insert captures where `event_type == 'PAYMENT.CAPTURE.COMPLETED'`.

Prometheus / Grafana integration:
- Option A (simple): expose `/metrics` endpoint that returns per-provider totals (cents) and row counts as Prometheus metrics. Grafana reads Prometheus.
- Option B: use Grafana SQLite datasource and point at `earnings.sqlite` directly; build panels for per-provider totals and sealed_hash (as table text).

README & Runbook
-----------------
See `README.md` (root) for quick start. Keep it updated when adding providers.

Final notes
-----------
- This codex is a living document. When you add a vector, update the API contract, env vars, and README.
- For production, consider moving the ledger to a managed DB, adding backups, and signing sealed hashes with an asymmetric key for non-repudiation.

Next actions I can take for you
- Add `/gumroad/webhook` implementation and `/totals/gumroad` endpoint.
- Add a lightweight `/metrics` Prometheus exporter and provide a Grafana dashboard JSON.
- Implement epoch persistence (book-of-earnings files) and a small CLI to seal and commit epochs.

Tell me which next action you want and I’ll implement it.

Sample Gumroad webhook (redacted) — JSON variant

```json
{
  "id": "sale_XXXXXXXX",
  "purchase_id": "p_12345",
  "product_id": "prod_abc",
  "price_cents": 1234,
  "currency": "USD",
  "created_at": "2025-08-21T12:34:56Z",
  "buyer_email": "redacted@example.com"
}
```

Quick test (PowerShell):

```pwsh
# payload.json contains the sample above
$raw = Get-Content payload.json -Raw
$hmac = (New-Object System.Security.Cryptography.HMACSHA256([System.Text.Encoding]::UTF8.GetBytes($env:GUMROAD_SIGNING_SECRET))).ComputeHash([System.Text.Encoding]::UTF8.GetBytes($raw))
$sig = ($hmac | ForEach-Object { $_.ToString('x2') }) -join ''
Invoke-RestMethod -Uri http://127.0.0.1:8000/gumroad/webhook -Method POST -Body $raw -ContentType 'application/json' -Headers @{ 'X-Gumroad-Signature' = $sig }
```
