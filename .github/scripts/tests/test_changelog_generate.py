import os
import sys
import json
import tempfile
import pytest
from unittest import mock
from pathlib import Path

# Import the refactored changelog_generate functions
sys.path.insert(0, str(Path(__file__).parent.parent))
import changelog_generate as cg

FIXTURE_DIR = Path(__file__).parent / "fixtures"

@pytest.fixture
def mock_prs():
    with open(FIXTURE_DIR / "mock_prs.json", encoding="utf-8") as f:
        return json.load(f)

def test_generate_changelog_basic(mock_prs):
    label_families = ["type", "scope", "domain"]
    changelog, lint_errors = cg.generate_changelog(mock_prs, label_families)
    assert "Add new feature X" in changelog
    assert "Fix security issue" in changelog
    assert "Refactor codebase" in changelog
    assert not lint_errors

def test_generate_changelog_missing_labels():
    prs = [
        {"number": 104, "title": "No labels PR", "labels": [], "merged_at": "2025-08-22T10:00:00Z"}
    ]
    label_families = ["type", "scope", "domain"]
    changelog, lint_errors = cg.generate_changelog(prs, label_families)
    assert "No labels PR" in changelog
    assert any("missing required label" in e for e in lint_errors)

def test_write_changelog_dry_run(tmp_path, mock_prs):
    label_families = ["type", "scope", "domain"]
    changelog, _ = cg.generate_changelog(mock_prs, label_families)
    # Dry run: do not write to file
    # Actually test write_changelog
    file_path = tmp_path / "CHANGELOG.md"
    cg.write_changelog(changelog, str(file_path))
    with open(file_path, encoding="utf-8") as f:
        content = f.read()
    assert "Add new feature X" in content
    assert "Fix security issue" in content
    assert "Refactor codebase" in content

def test_cli_dry_run(monkeypatch, mock_prs, capsys):
    # Patch get_merged_prs_for_tag to return mock_prs
    monkeypatch.setattr(cg, "get_merged_prs_for_tag", lambda *a, **kw: mock_prs)
    testargs = ["prog", "--dry-run", "--tag", "v1.2.3", "--repo", "foo/bar", "--token", "dummy"]
    monkeypatch.setattr(sys, "argv", testargs)
    cg.main()
    out = capsys.readouterr().out
    assert "Add new feature X" in out
    assert "Fix security issue" in out
    assert "Refactor codebase" in out
