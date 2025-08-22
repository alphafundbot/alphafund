import os
import requests

BASE = "http://127.0.0.1:8000"
ENDPOINTS = [
    "/totals/stripe",
    "/totals/gumroad",
    "/totals/upwork",
    "/dashboard"
]
TOKEN = os.getenv("DASHBOARD_TOKEN") or ""
WRONG_TOKEN = "not-the-right-token"

phases = [
    ("Without token (expect 403)", None),
    ("With correct token (expect 200)", TOKEN),
    ("With wrong token (expect 403)", WRONG_TOKEN),
]

for label, token in phases:
    print(f"\n=== {label} ===")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    for ep in ENDPOINTS:
        url = BASE + ep
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            print(f"{ep} -> {resp.status_code} {resp.reason}")
            if ep.startswith("/totals/") and resp.status_code == 200:
                print(f"  Body: {resp.text}")
            elif ep == "/dashboard" and resp.status_code == 200:
                print(f"  Body: [HTML content omitted]")
        except requests.HTTPError as e:
            print(f"{ep} -> HTTPError: {e.response.status_code} {e.response.reason}")
        except Exception as e:
            print(f"{ep} -> ERROR: {e}")
