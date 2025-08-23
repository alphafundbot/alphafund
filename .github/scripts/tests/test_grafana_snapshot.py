sys.path.insert(0, str(Path(__file__).parent.parent))
import json
import pytest
from unittest import mock
from pathlib import Path
import sys
from typing import Any

sys.path.insert(0, str(Path(__file__).parent.parent))
import grafana_snapshot as gs

MOCK_DASHBOARD_JSON: dict[str, Any] = {
    "dashboard": {"title": "Test Dashboard", "panels": []}
}
MOCK_SNAPSHOT_RESPONSE: dict[str, str] = {
    "url": "https://grafana.example.com/snapshot/abc123",
    "deleteUrl": "https://grafana.example.com/snapshot/delete/abc123"
}

def test_fetch_dashboard_json(monkeypatch: pytest.MonkeyPatch) -> None:
    def mock_get(url: str, headers: dict[str, str]) -> Any:
        class Resp:
            def raise_for_status(self) -> None: pass
            def json(self) -> dict[str, Any]: return MOCK_DASHBOARD_JSON
        return Resp()
    monkeypatch.setattr(gs.requests, "get", mock_get)
    result = gs.fetch_dashboard_json("https://grafana.example.com", "uid123", "token", verbose=True)
    assert result == MOCK_DASHBOARD_JSON

def test_create_snapshot(monkeypatch: pytest.MonkeyPatch) -> None:
    def mock_post(url: str, headers: dict[str, str], data: str) -> Any:
        class Resp:
            def raise_for_status(self) -> None: pass
            def json(self) -> dict[str, str]: return MOCK_SNAPSHOT_RESPONSE
        return Resp()
    monkeypatch.setattr(gs.requests, "post", mock_post)
    result = gs.create_snapshot("https://grafana.example.com", MOCK_DASHBOARD_JSON, "token", expires=3600, verbose=True)
    assert result["url"].startswith("https://grafana.example.com/snapshot/")

def test_save_snapshot_json(tmp_path: Path) -> None:
    path = tmp_path / "snapshot.json"
    gs.save_snapshot_json(MOCK_SNAPSHOT_RESPONSE, str(path), verbose=True)
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    assert data["url"] == MOCK_SNAPSHOT_RESPONSE["url"]

def test_main_dry_run(monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    monkeypatch.setattr(gs, "fetch_dashboard_json", lambda *a, **k: MOCK_DASHBOARD_JSON)
    monkeypatch.setattr(gs, "create_snapshot", lambda *a, **k: MOCK_SNAPSHOT_RESPONSE)
    testargs = ["prog", "--grafana-url", "https://grafana.example.com", "--dashboard-uid", "uid123", "--api-key", "token", "--dry-run"]
    monkeypatch.setattr(sys, "argv", testargs)
    gs.main()
    out = capsys.readouterr().out
    assert "Test Dashboard" in out
