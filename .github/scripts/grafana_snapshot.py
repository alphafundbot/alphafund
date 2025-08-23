import os
import requests
import argparse
import json

from typing import Any

def fetch_dashboard_json(
    grafana_url: str,
    dashboard_uid: str,
    api_key: str,
    verbose: bool = False
) -> dict[str, Any]:
    """Fetches a Grafana dashboard JSON by UID using the provided API key."""
    url = f"{grafana_url}/api/dashboards/uid/{dashboard_uid}"
    headers = {"Authorization": f"Bearer {api_key}"}
    if verbose:
        print(f"Fetching dashboard JSON from {url}")
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json()

def create_snapshot(
    grafana_url: str,
    dashboard_json: dict[str, Any],
    api_key: str,
    expires: int = 3600,
    verbose: bool = False
) -> dict[str, Any]:
    """Creates a snapshot of the given Grafana dashboard JSON."""
    url = f"{grafana_url}/api/snapshots"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "dashboard": dashboard_json["dashboard"],
        "expires": expires
    }
    if verbose:
        print(f"Creating snapshot via {url}")
    resp = requests.post(url, headers=headers, data=json.dumps(payload))
    resp.raise_for_status()
    return resp.json()

def save_snapshot_json(
    snapshot_json: dict[str, Any],
    path: str = "dashboard_snapshot.json",
    verbose: bool = False
) -> None:
    """Saves the snapshot JSON to a file."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(snapshot_json, f, indent=2)
    if verbose:
        print(f"Snapshot JSON saved to {path}")


def main() -> None:
    """Main entry point for the Grafana dashboard snapshot script."""
    parser = argparse.ArgumentParser(description="Grafana dashboard snapshot script")
    parser.add_argument("--grafana-url", required=True, help="Grafana base URL (e.g. https://your.grafana.net)")
    parser.add_argument("--dashboard-uid", required=True, help="Dashboard UID to snapshot")
    parser.add_argument("--api-key", required=False, help="Grafana API key (or set GRAFANA_API_KEY env var)")
    parser.add_argument("--expires", type=int, default=3600, help="Snapshot expiration in seconds")
    parser.add_argument("--output", default="dashboard_snapshot.json", help="Output file path")
    parser.add_argument("--dry-run", action="store_true", help="Only fetch dashboard JSON, do not create snapshot")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()

    api_key = args.api_key or os.getenv("GRAFANA_API_KEY")
    if not api_key:
        raise RuntimeError("Grafana API key must be provided via --api-key or GRAFANA_API_KEY env var")

    dashboard_json = fetch_dashboard_json(args.grafana_url, args.dashboard_uid, api_key, args.verbose)
    if args.dry_run:
        print(json.dumps(dashboard_json, indent=2))
        return
    snapshot_json = create_snapshot(args.grafana_url, dashboard_json, api_key, args.expires, args.verbose)
    save_snapshot_json(snapshot_json, args.output, args.verbose)
    print(f"Snapshot URL: {snapshot_json.get('url')}")

if __name__ == "__main__":
    main()
