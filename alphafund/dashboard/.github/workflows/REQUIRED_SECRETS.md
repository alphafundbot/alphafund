# Required GitHub Secrets for gate_check.yml

Add these secrets to your repository settings for the workflow to function:

## General
- `SLACK_WEBHOOK` — Slack webhook URL for notifications
- `SLACK_CHANNEL` — Slack channel name or ID
- `SMTP_USER` — SMTP username for email alerts
- `SMTP_PASSWORD` — SMTP password for email alerts
- `PAGERDUTY_ROUTING_KEY` — PagerDuty integration key
- `SNYK_TOKEN` — Snyk API token (for security scan)

## Staging Environment
- `STAGING_BASE_URL` — Staging API base URL
- `STAGING_DB_HOST` — Staging DB host
- `STAGING_DB_PORT` — Staging DB port
- `STAGING_DB_NAME` — Staging DB name
- `STAGING_DB_USER` — Staging DB user
- `STAGING_DB_PASSWORD` — Staging DB password
- `STAGING_PAYMENT_GATEWAY_KEY` — Staging payment gateway key

## Canary Environment
- `CANARY_BASE_URL` — Canary API base URL
- `CANARY_DB_HOST` — Canary DB host
- `CANARY_DB_PORT` — Canary DB port
- `CANARY_DB_NAME` — Canary DB name
- `CANARY_DB_USER` — Canary DB user
- `CANARY_DB_PASSWORD` — Canary DB password
- `CANARY_PAYMENT_GATEWAY_KEY` — Canary payment gateway key

## Production Environment
- `PROD_BASE_URL` — Production API base URL
- `PROD_DB_HOST` — Production DB host
- `PROD_DB_PORT` — Production DB port
- `PROD_DB_NAME` — Production DB name
- `PROD_DB_USER` — Production DB user
- `PROD_DB_PASSWORD` — Production DB password
- `PROD_PAYMENT_GATEWAY_KEY` — Production payment gateway key

---

**Note:**
- Update the `from:` field in email steps if you want a different sender address.
- Ensure all referenced secrets are set before running the workflow.
