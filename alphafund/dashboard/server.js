import os
import json
import requests
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone
from fastapi import Request, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# ...existing code...

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
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 6000;

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle signals endpoint
  if (req.url === '/signals') {
    fs.readFile(path.join(process.env.HOME, 'signals.json'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading signals');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    });
    return;
  }
  
  // Handle root request
  let filePath = req.url;
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Resolve the file path
  filePath = path.join(__dirname, filePath);
  
  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
