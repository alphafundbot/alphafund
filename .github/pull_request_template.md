# 🚦 Pull Request Audit Template

## 📜 Changelog Review
- **Changelog diff:**
  - See the PR comments and workflow logs for a full semantic diff of `CHANGELOG.md`.
- **Full changelog artifact:**
  - **🔗 Full Changelog Artifact:** [View here](<artifact-link-will-appear-here>)
  - _(This link is auto-updated by CI. If missing, rerun the workflow or check the latest run artifacts.)_

---

## 🧾 Reviewer Checklist
- [ ] Changelog accurately reflects all user-facing and internal changes
- [ ] No sensitive or security-relevant information is exposed in the changelog
- [ ] Artifact link is present and resolves to the correct file
- [ ] All CI checks pass and changelog automation steps are green
- [ ] PR description and changelog are consistent

---

## 🗒️ Notes for Reviewers
- The changelog diff is posted both in the logs and as a PR comment for convenience.
- The artifact link above is always the latest, thanks to the self-updating workflow.
- If the diff is too large, activate the truncation guard in the workflow for concise output.

---

_This template is maintained by the changelog automation ritual. For questions or improvements, see `.github/workflows/changelog_ritual.yml`._
