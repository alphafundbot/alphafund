# Sovereign Release Ritual

## 🏛️ Flow Diagram

```
Sentinel 1 (Validate Release Integrity)
   ↓
Changelog Generation
   ↓
Metrics Push to Grafana
   ↓
Dashboard Snapshot Capture
   ↓
Artifact Archival
   ↓
Broadcast Notifications (Slack/Discord)
   ↓
Sovereign Release Complete
```

---

## 🔐 Secrets Table

| Secret Name            | Purpose                                 | Scope                | Rotation Policy         |
|-----------------------|-----------------------------------------|----------------------|------------------------|
| `GITHUB_TOKEN`        | GitHub API access for changelog/PRs     | Workflow/job         | Rotate on compromise   |
| `GRAFANA_API_KEY`     | Push metrics & snapshots to Grafana     | Metrics, snapshot    | Rotate quarterly       |
| `DISCORD_WEBHOOK_URL` | Send notifications to Discord           | Notification         | Rotate on change       |
| `SLACK_WEBHOOK_URL`   | Send notifications to Slack             | Notification         | Rotate on change       |

---

## 🧭 Manual Trigger Guide

- **Local dry-run:**
  - Run `pytest scripts/tests/` to validate all ritual scripts.
  - Use CLI flags (`--dry-run`, `--verbose`) for local simulation:
    ```sh
    python .github/scripts/changelog_generate.py --dry-run --tag v1.2.3 --repo owner/repo --token $GITHUB_TOKEN
    python .github/scripts/grafana_snapshot.py --grafana-url https://your.grafana.net --dashboard-uid <UID> --api-key $GRAFANA_API_KEY --dry-run
    ```
- **Manual GitHub Actions trigger:**
  - Use the `workflow_dispatch` event in the Actions tab to run the ritual on demand.

---

## 🧬 Extension Points

- **Sentinel 2:** Dashboard health probe before snapshot
- **Sentinel 3:** Changelog intelligence overlay (e.g., highlight breaking/security changes)
- **Additional notifications:** Add more channels or custom payloads
- **Artifact retention:** Tune archival and retention policies as needed

---

## 🛡️ Audit Notes

- **Regex gatekeeper:** Only tags matching `vX.Y.Z` are allowed to proceed
- **Artifact naming:** Changelog and snapshot artifacts are versioned by release tag
- **Retention:** Artifacts retained per GitHub Actions and organizational policy
- **Error handling:** All failures are logged and halt the ritual for audit clarity

---

## ✅ Verification Log

- **Test Run Date:** <!-- Fill in after pytest run -->
- **Test Suite:** `pytest scripts/tests/`
- **Summary:**
  - Passed: <!-- X -->
  - Failed: <!-- Y -->
  - Duration: <!-- Z seconds -->

**Key Excerpts:**
```
# Paste Sentinel 1 validation, changelog generation, metric push, snapshot mock outputs here
```

---

## 🟢 First Live Echo (CI/CD Simulation)

- **CI Run Date:** <!-- Fill in after workflow run -->
- **Tag:** `v1.2.3-test`
- **GitHub Actions Logs:**
  - [Link to workflow run](<!-- URL -->)
- **Artifacts:**
  - [Changelog artifact](<!-- URL -->)
  - [Snapshot JSON artifact](<!-- URL -->)
- **Broadcasts:**
  - Slack/Discord message excerpt:
    ```
    # Paste notification payload or message here
    ```

---

*This document is a living artifact. Update with each new sentinel, ritual refinement, or operational lesson.*
