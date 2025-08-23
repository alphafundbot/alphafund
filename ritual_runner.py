
import argparse
import json
import os
import sys
import sqlite3
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import Any, Dict, Optional, List, Tuple
import tempfile
import re


def compute_sha256(obj: Any) -> str:
    """Return SHA-256 hex digest of canonical JSON encoding of obj."""
    import hashlib
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

# --- Utility: ISO UTC now ---
def iso_utc_now() -> str:
    """Return current UTC time in ISO 8601 format with Z."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')

# --- Validation: Provider epoch ---
def validate_provider_epoch(epoch: Dict[str, Any], provider: str) -> None:
    """Ensure provider block exists and has required fields."""
    if "sources" not in epoch or provider not in epoch["sources"]:
        raise ValueError(f"Epoch for provider '{provider}' missing sources/{provider} block.")
    block = epoch["sources"][provider]
    if "total" not in block:
        raise ValueError(f"Epoch for provider '{provider}' missing total in sources block.")

# --- Validation: Unified epoch ---
def validate_unified_epoch(unified: Dict[str, Any], providers: List[str]) -> None:
    """Ensure unified epoch covers all providers and has grand_total."""
    if "sources" not in unified or "totals" not in unified:
        raise ValueError("Unified epoch missing sources or totals block.")
    for p in providers:
        if p not in unified["sources"]:
            raise ValueError(f"Unified epoch missing provider: {p}")
    if "grand_total" not in unified["totals"]:
        raise ValueError("Unified epoch missing grand_total in totals.")
import argparse, json, os, sys, sqlite3

# --- Main

def main() -> None:
    ap = argparse.ArgumentParser(description="Ritual runner: seal providers sequentially, then unified epoch.")
    ap.add_argument("--providers-file", required=True, help="JSON file: {'providers': {'stripe': '/path/file.json', ...}}")
    ap.add_argument("--book", required=True, help="Book of Earnings path (.json or .jsonl)")
    ap.add_argument("--jsonl", action="store_true", help="Use JSONL format (append-only).")
    ap.add_argument("--sqlite", default="", help="Optional SQLite DB path to mirror seals (for cockpit). Also used as SQL source DB.")
    ap.add_argument("--sql-json-column", default="epoch_json", help="Column name to extract JSON from when using SQL ingestion.")
    ap.add_argument("--epoch-id", default="", help="Override epoch_id for unified seal (default: current UTC).")
    ap.add_argument("--currency", default="USD", help="Currency code for unified grand_total.")
    ap.add_argument("--period-start", default="", help="Optional period_start override for unified epoch.")
    ap.add_argument("--period-end", default="", help="Optional period_end override for unified epoch.")
    ap.add_argument("--noninteractive", action="store_true", help="Do not pause for manual cockpit verification.")
    ap.add_argument("--auto-verify", action="store_true", help="After each seal, confirm latest hash exists in SQLite.")
    ap.add_argument("--parallel", action="store_true", help="Ingest and seal all providers in parallel.")
    args = ap.parse_args()

    providers = load_providers_map(args.providers_file)
    provider_epochs: Dict[str, Dict[str, Any]] = {}
    verified: Dict[str, bool] = {}

    def ingest_and_validate(provider: str, locator: Any) -> Tuple[str, Dict[str, Any], float]:
        """Ingest and validate a provider epoch, returning provider, epoch, and elapsed time."""
        start = time.time()
        locator_str: str = str(locator).strip()
        engine: Optional[str] = None
        dsn: Optional[str] = None
        query: Optional[str] = None
        if locator_str.lower().startswith("select "):
            if not args.sqlite:
                raise RuntimeError(f"SQL locator for provider '{provider}' but no --sqlite DB specified.")
            engine = "sqlite"
            dsn = args.sqlite
            query = locator_str
        elif locator_str.lower().startswith("postgres:") or locator_str.lower().startswith("mysql:") or locator_str.lower().startswith("sqlite:"):
            parts = locator_str.split(":", 2)
            if len(parts) != 3:
                raise RuntimeError(f"Invalid SQL locator format for provider '{provider}': {locator_str}")
            engine, dsn, query = parts
            engine = engine.lower()
        if engine:
            epoch = load_epoch_from_sql(engine, dsn, query, args.sql_json_column)
        else:
            if not os.path.exists(locator):
                raise RuntimeError(f"File not found for provider '{provider}': {locator}")
            epoch = load_epoch_from_path(locator)
        validate_provider_epoch(epoch, provider)
        elapsed: float = time.time() - start
        print(f"[{provider}] ingestion complete in {elapsed:.2f}s")
        return provider, epoch, elapsed

    start_time: float = time.time()
    results: List[Tuple[str, Dict[str, Any], float]] = []
    if args.parallel:
        print("[PARALLEL] Ingesting and sealing all providers in parallel...")
        with ThreadPoolExecutor(max_workers=len(providers)) as executor:
            futures = {executor.submit(ingest_and_validate, name, locator): name for name, locator in providers.items()}
            for future in as_completed(futures):
                name = futures[future]
                try:
                    provider, epoch, elapsed = future.result()
                    results.append((provider, epoch, elapsed))
                except Exception as e:
                    print(f"[{name}] failed: {e}", file=sys.stderr)
        # Seal all validated epochs
        for provider, epoch, elapsed in results:
            h, seal_time = seal_epoch(args.book, args.jsonl, args.sqlite, epoch)
            provider_epochs[provider] = epoch
            verified[provider] = True
    else:
        for provider, locator in providers.items():
            try:
                provider, epoch, elapsed = ingest_and_validate(provider, locator)
                h, seal_time = seal_epoch(args.book, args.jsonl, args.sqlite, epoch)
                provider_epochs[provider] = epoch
                verified[provider] = True
            except Exception as e:
                print(f"[{provider}] failed: {e}", file=sys.stderr)

    # Unified pass
    missing: List[str] = [p for p in providers.keys() if not verified.get(p)]
    if missing:
        print(f"ERROR: Not all providers verified: {missing}", file=sys.stderr)
        sys.exit(2)

    epoch_id: str = args.epoch_id or iso_utc_now()
    unified: Dict[str, Any] = build_unified_epoch(
        epoch_id=epoch_id,
        provider_epochs=provider_epochs,
        currency=args.currency,
        period_start=args.period_start,
        period_end=args.period_end,
        notes="Unified liquidity epoch"
    )
    validate_unified_epoch(unified, list(providers.keys()))
    uh, useal_time = seal_epoch(args.book, args.jsonl, args.sqlite, unified)

    if args.auto_verify:
        ok: bool = sqlite_latest_hash_matches(args.sqlite, uh)
        if not ok:
            print("ERROR: Auto-verify failed in SQLite for unified epoch (hash mismatch).", file=sys.stderr)
            sys.exit(2)

    elapsed: float = time.perf_counter() - start_time
    print(f"UNIFIED SEALED | utc={useal_time} | hash={uh} | epoch_id={epoch_id} | providers={','.join(providers.keys())}")
    print(f"[PARALLEL] Total cycle time: {elapsed:.2f} seconds" if args.parallel else f"Total cycle time: {elapsed:.2f} seconds")

    # After all provider seals and unified seal
    telemetry: Dict[str, Any] = {
        "run_utc": iso_utc_now(),
        "parallel": args.parallel,
        "providers": {},
        "unified": {
            "epoch_id": epoch_id,
            "seal_hash": uh,
            "seal_time": useal_time,
            "cycle_seconds": elapsed,
        }
    }
    if args.parallel:
        for provider, epoch, elapsed_time in results:
            telemetry["providers"][provider] = {
                "epoch_id": epoch.get("epoch_id", ""),
                "seal_hash": compute_sha256(epoch),
                "elapsed_seconds": elapsed_time,
            }
    else:
        for provider in provider_epochs:
            telemetry["providers"][provider] = {
                "epoch_id": provider_epochs[provider].get("epoch_id", ""),
                "seal_hash": compute_sha256(provider_epochs[provider]),
                "elapsed_seconds": 0.0,
            }
    with open("telemetry.json", "w", encoding="utf-8") as tf:
        json.dump(telemetry, tf, indent=2)
    # --- Main entry point ---
if __name__ == "__main__":
    main()

# --- SQLite telemetry mirror (polished) ---
def sqlite_mirror(db_path: str, record: Dict[str, Any]) -> None:
    """
    Mirror a seal event into a local SQLite DB for cockpit/telemetry.
    """
    if not db_path:
        return
    import sqlite3
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS sealed_epochs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                seal_utc TEXT NOT NULL,
                hash TEXT NOT NULL,
                epoch_id TEXT,
                grand_total REAL,
                currency TEXT,
                epoch_json TEXT NOT NULL
            )
            """
        )
        e = record["epoch"]
        epoch_id = e.get("epoch_id")
        totals = e.get("totals", {})
        grand_total = totals.get("grand_total")
        currency = totals.get("currency")
        cur.execute(
            """
            INSERT INTO sealed_epochs (seal_utc, hash, epoch_id, grand_total, currency, epoch_json)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (record["seal_utc"], record["hash"], epoch_id, grand_total, currency, json.dumps(e, separators=(",", ":")))
        )
        conn.commit()
    finally:
        conn.close()

def sqlite_latest_hash_matches(db_path: str, expected_hash: str) -> bool:
    if not db_path or not os.path.exists(db_path):
        return False
    conn = sqlite3.connect(db_path)
    try:
        cur = conn.cursor()
        cur.execute("SELECT hash FROM sealed_epochs ORDER BY datetime(seal_utc) DESC, id DESC LIMIT 1;")
        row = cur.fetchone()
        return bool(row and row[0] == expected_hash)
    finally:
        conn.close()

# ---------------------------
# Provider loading
# ---------------------------

def load_providers_map(path: str) -> Dict[str, str]:
    # Expect JSON: {"providers": {"stripe": "/path/file.json", ...}}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict) or "providers" not in data or not isinstance(data["providers"], dict):
        raise ValueError("Providers file must be JSON with a top-level 'providers' mapping.")
    # Values are either file paths or SQL SELECT strings
    return {k: v for k, v in data["providers"].items()}


def load_epoch_from_path(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# --- SQL ingestion support ---

# --- Multi-engine SQL ingestion support ---
def load_epoch_from_sql(
    engine: str,
    dsn: str,
    query: str,
    json_column: str = "epoch_json"
) -> Dict[str, Any]:
    """Ingest epoch from SQL source (Postgres/MySQL/SQLite). Always use row[0] for JSON column."""
    if engine == "postgres":
        try:
            import psycopg2
        except ImportError:
            raise ImportError("psycopg2 is required for Postgres ingestion. Please install it via 'pip install psycopg2-binary'.")
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        cur.execute(query)
        row = cur.fetchone()
        if not row:
            raise RuntimeError("No rows returned from Postgres query.")
        # Always use row[0] for JSON column (avoid type errors with named columns)
        data = row[0]
        conn.close()
        return json.loads(data)
    elif engine == "mysql":
        try:
            import mysql.connector
        except ImportError:
            raise ImportError("mysql-connector-python is required for MySQL ingestion. Please install it via 'pip install mysql-connector-python'.")
        conn = mysql.connector.connect(**parse_mysql_dsn(dsn))
        cur = conn.cursor()
        cur.execute(query)
        row = cur.fetchone()
        if not row:
            raise RuntimeError("No rows returned from MySQL query.")
        # Always use row[0] for JSON column (avoid type errors with named columns)
        data = row[0]
        conn.close()
        return json.loads(data)
    else:
        raise ValueError(f"Unsupported SQL engine: {engine}")

# Helper for MySQL DSN parsing (simple URI or dict)
def parse_mysql_dsn(dsn: str) -> Dict[str, Any]:
    """Parse a MySQL DSN string into a dict for mysql.connector.connect."""
    # Accepts DSN as URI: mysql://user:pass@host:port/db
    # or as JSON dict string
    import re, json
    if dsn.strip().startswith("{"):
        return json.loads(dsn)
    m = re.match(r"mysql://([^:]+):([^@]+)@([^:/]+)(?::(\d+))?/([^?]+)", dsn)
    if not m:
        raise ValueError("Invalid MySQL DSN format.")
    user, password, host, port, database = m.groups()
    return {
        "user": user,
        "password": password,
        "host": host,
        "port": int(port) if port else 3306,
        "database": database
    }

# ---------------------------
# Sealing
# ---------------------------

def seal_epoch(book_path: str, use_jsonl: bool, sqlite_path: str, epoch: Dict[str, Any]) -> Tuple[str, str]:
    h = compute_sha256(epoch)
    seal_time = iso_utc_now()
    record = {"hash": h, "seal_utc": seal_time, "epoch": epoch}
    if use_jsonl or book_path.endswith(".jsonl"):
        append_jsonl(book_path, record)
    else:
        atomic_append_json_array(book_path, record)
    sqlite_mirror(sqlite_path, record)
    print(f"SEALED | utc={seal_time} | hash={h} | epoch_id={epoch.get('epoch_id','')} | book={book_path}")
    return h, seal_time

    # --- Helper stubs for JSONL and atomic JSON array append ---
def append_jsonl(path: str, record: Dict[str, Any]) -> None:
        """
        Append a record as a single line of JSON to a .jsonl file.
        Stub: Replace with robust file locking/atomic logic as needed.
        """
        import json
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, separators=(",", ":"), ensure_ascii=False) + "\n")

def atomic_append_json_array(path: str, record: Dict[str, Any]) -> None:
        """
        Atomically append a record to a JSON array file (read-modify-write).
        Stub: Replace with robust file locking/atomic logic as needed.
        """
        import json, os, tempfile
        arr = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                try:
                    arr = json.load(f)
                except Exception:
                    arr = []
        arr.append(record)
        # Write to temp file then move for atomicity
        dir_name = os.path.dirname(os.path.abspath(path))
        with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tf:
            json.dump(arr, tf, separators=(",", ":"), ensure_ascii=False)
            tempname = tf.name
        os.replace(tempname, path)

# ---------------------------
# Unified epoch construction
# ---------------------------

def build_unified_epoch(
    epoch_id: str,
    provider_epochs: Dict[str, Dict[str, Any]],
    currency: str,
    period_start: str = "",
    period_end: str = "",
    notes: str = "Unified liquidity epoch"
) -> Dict[str, Any]:
    sources = {}
    grand_total = 0.0
    # Find a representative epoch for meta fallback (first in dict)
    first_ep = next(iter(provider_epochs.values()), {})
    for provider, ep in provider_epochs.items():
        block = ep["sources"][provider]
        sources[provider] = block
        if isinstance(block.get("total"), (int, float)):
            grand_total += float(block["total"])
    meta_block = first_ep.get("meta", {}) if isinstance(first_ep, dict) else {}
    unified = {
        "epoch_id": epoch_id,
        "sources": sources,
        "totals": {
            "grand_total": round(grand_total, 6),
            "currency": currency
        },
        "meta": {
            "period_start": period_start or meta_block.get("period_start", ""),
            "period_end": period_end or meta_block.get("period_end", ""),
            "notes": notes
        }
    }
    return unified


