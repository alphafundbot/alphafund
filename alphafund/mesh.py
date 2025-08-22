#!/usr/bin/env python3
"""mesh CLI - lightweight test harness for mesh components

Usage:
  python mesh.py test gumroad
"""
import os
import sys
import json
import hmac
import hashlib
import requests
from dotenv import load_dotenv

load_dotenv()

GUMROAD_SIGNING_SECRET = os.getenv('GUMROAD_SIGNING_SECRET')
BACKEND_URL = os.getenv('MESH_BACKEND', 'http://127.0.0.1:8000')

sample_payload = {
    "id": "sale_test_001",
    "purchase_id": "p_test_001",
    "product_id": "prod_test_01",
    "product_name": "Test Product",
    "price_cents": 1234,
    "currency": "USD",
    "created_at": "2025-08-21T12:34:56Z",
    "buyer_email": "tester@example.com",
}


def sign_and_post_gumroad(payload: dict):
    raw = json.dumps(payload).encode('utf-8')
    if not GUMROAD_SIGNING_SECRET:
        print('Missing GUMROAD_SIGNING_SECRET in env')
        return 2
    mac = hmac.new(GUMROAD_SIGNING_SECRET.encode(), raw, hashlib.sha256).hexdigest()
    headers = {'Content-Type': 'application/json', 'X-Gumroad-Signature': mac}
    url = BACKEND_URL.rstrip('/') + '/gumroad/webhook'
    resp = requests.post(url, data=raw, headers=headers, timeout=10)
    print('POST', url, '->', resp.status_code)
    print(resp.text)
    return 0


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'test' and sys.argv[2] == 'gumroad':
        sys.exit(sign_and_post_gumroad(sample_payload))
    print('Usage: mesh.py test gumroad')
    sys.exit(1)
