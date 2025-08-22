Gate Check
----------

To verify that all dashboard and totals endpoints are properly protected by `DASHBOARD_TOKEN`, use the portable `gate_check.py` script:

1. Ensure your backend is running with `DASHBOARD_TOKEN` set in the environment.
2. Install Python 3.7+ and the `requests` package:
	```bash
	pip install requests
	```
3. Run the check:
	```bash
	python gate_check.py
	```

The script runs three phases:
- **Without token**: All endpoints should return 403 Forbidden.
- **With correct token**: All endpoints should return 200 OK (JSON for `/totals/*`, HTML for `/dashboard`).
- **With wrong token**: All endpoints should return 403 Forbidden again.

This ritual ensures your liquidity mesh is never accidentally exposed, and can be run locally or in CI/CD.
# AlphaFund Liquidity Mesh

This repository contains the AlphaFund dashboard and a FastAPI backend that ingests live revenue events from multiple providers (Stripe, Upwork, Gumroad, PayPal planned).

Quick start
-----------

1. Create a `.env` in the project root with the required keys:

```
STRIPE_API_KEY=sk_live_...
OPENEXCHANGERATES_APP_ID=your_app_id
# Optional for other vectors
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
GUMROAD_SIGNING_SECRET=...
UPWORK_BEARER_TOKEN=...
UPWORK_EARNINGS_URL=...
```

2. Install Python dependencies:

```pwsh
pip install fastapi uvicorn python-dotenv requests stripe
```

3. Start the backend (from `alphafund/`):

```pwsh
uvicorn main:app --reload --port 8000
```

4. Serve the dashboard (from `alphafund/dashboard`):

```pwsh
python -m http.server 8080
```

5. Open `http://localhost:8080/index.html` and watch the Liquidity card. It polls `/totals/stripe` and `/totals/upwork` every 60s.

Verification
------------

- Hit `/stripe/sync` and `/upwork/sync` (POST) to ingest events (Upwork expects a `report` payload as the Upwork Reports API returns).
- Check `/totals/stripe` and `/totals/upwork` to see totals and sealed hashes.
- Inspect `earnings.sqlite` for raw rows and audit payloads.

Extending the mesh
------------------

- To add PayPal or Gumroad, append their webhook verification logic to `main.py` and use `insert_earning()` to persist.
- Keep secrets in `.env` and add them to `.gitignore`.

Security and integrity
----------------------

- All events are verified (HMAC/PayPal verification when implemented) and persisted idempotently (unique `event_id`).
- Totals are sealed with a DB hash to provide epoch integrity for your Book of Earnings.

Support
-------

If you want, I can help wire additional vectors or generate Grafana dashboards around `earnings.sqlite`.

Gumroad webhook
---------------

The project now includes a `/gumroad/webhook` endpoint which accepts Gumroad sale webhooks. It verifies the body using an HMAC-SHA256 signature with the environment variable `GUMROAD_SIGNING_SECRET` and inserts idempotent, auditable rows into `earnings.sqlite`.

Quick test (PowerShell):

```pwsh
# Save a redacted sample payload to payload.json
$raw = Get-Content payload.json -Raw
$hmac = (New-Object System.Security.Cryptography.HMACSHA256([System.Text.Encoding]::UTF8.GetBytes($env:GUMROAD_SIGNING_SECRET))).ComputeHash([System.Text.Encoding]::UTF8.GetBytes($raw))
$sig = ($hmac | ForEach-Object { $_.ToString('x2') }) -join ''
Invoke-RestMethod -Uri http://127.0.0.1:8000/gumroad/webhook -Method POST -Body $raw -ContentType 'application/json' -Headers @{ 'X-Gumroad-Signature' = $sig }
```

On success you'll receive `{"status":"ok"}` and the sale will appear in the dashboard totals.

Secure Dashboard
----------------

You can protect the dashboard and totals endpoints with a simple bearer token by setting `DASHBOARD_TOKEN` in your `.env` or environment. When set, clients must send `Authorization: Bearer <token>` to access `/dashboard` and `/totals/*`.

Example `.env` entry:

```
DASHBOARD_TOKEN=replace_with_a_strong_secret
```

Start the backend and open the protected dashboard:

```pwsh
uvicorn main:app --reload --port 8000
# open http://127.0.0.1:8000/dashboard in your browser
```

The dashboard UI stores the token in `localStorage` for convenience when you paste it into the input box on first load.
