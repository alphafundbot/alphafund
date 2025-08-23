import os
import sys
import json
import re
import argparse
from datetime import datetime, timezone
try:
    import requests
except ImportError:
    print("The 'requests' package is required. Please install it with 'pip install requests'.")
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument('--release-tag', required=True)
parser.add_argument('--changelog-path', required=True)
parser.add_argument('--diff-url', required=True)
args = parser.parse_args()

SLACK_WEBHOOK_URL = os.environ.get('SLACK_WEBHOOK_URL')
if not SLACK_WEBHOOK_URL:
    print('Missing SLACK_WEBHOOK_URL environment variable.')
    sys.exit(1)

with open(args.changelog_path, encoding='utf-8') as f:
    changelog = f.read()

# Extract the latest release section
pattern = re.compile(rf'## \[Release {re.escape(args.release_tag)}\](.*?)(?=^## |\Z)', re.DOTALL | re.MULTILINE)
match = pattern.search(changelog)
if not match:
    print(f'No changelog section found for {args.release_tag}')
    sys.exit(1)
section = match.group(1).strip()


# Load heraldry config
LABELS_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "labels_config.json")
heraldry = {}
if os.path.exists(LABELS_CONFIG_PATH):
    with open(LABELS_CONFIG_PATH, encoding="utf-8") as f:
        config = json.load(f)
        heraldry = config.get("heraldry", {})

# Extract label banner from the first banner line
banner_match = re.search(r'^### (.+)$', section, re.MULTILINE)
raw_banner = banner_match.group(1) if banner_match else ''

def render_banner(raw_banner: str) -> (str, str):
    # Parse e.g. 'type:feature | scope:api | domain:infra'
    if not raw_banner:
        return ('No labels found', '#dddddd')
    parts = [p.strip() for p in raw_banner.split('|')]
    icons = []
    color = '#dddddd'
    # Priority: type > scope > domain
    for fam in ['type', 'scope', 'domain']:
        for part in parts:
            if part.startswith(fam+':'):
                val = part.split(':',1)[1].strip()
                fam_map = heraldry.get(fam, {})
                meta = fam_map.get(val, {})
                icon = meta.get('icon', '')
                fam_color = meta.get('color')
                icons.append(f"{icon} {fam}:{val}" if icon else f"{fam}:{val}")
                if fam_color and color == '#dddddd':
                    color = fam_color
    # Add any other families
    for part in parts:
        fam = part.split(':',1)[0].strip()
        if fam not in ['type', 'scope', 'domain']:
            val = part.split(':',1)[1].strip()
            fam_map = heraldry.get(fam, {})
            meta = fam_map.get(val, {})
            icon = meta.get('icon', '')
            icons.append(f"{icon} {fam}:{val}" if icon else f"{fam}:{val}")
    return (' | '.join(icons), color)

banner, banner_color = render_banner(raw_banner)

# Extract up to 5 changelog entries
entries = re.findall(r'- PR #[0-9]+ — .+', section)
entries = entries[:5]
entries_text = '\n'.join(f'• {e}' for e in entries) if entries else 'No entries found.'

# Build Slack payload
payload = {
    "blocks": [
        {
            "type": "header",
            "text": { "type": "plain_text", "text": f"\U0001F4DC Release {args.release_tag} — {banner}" }
        },
        {
            "type": "section",
            "text": { "type": "mrkdwn", "text": f"*Changelog Highlights:*\n{entries_text}" }
        },
        {
            "type": "divider"
        },
        {
            "type": "actions",
            "elements": [
                { "type": "button", "text": { "type": "plain_text", "text": "View Full Changelog" }, "url": f"https://github.com/{os.environ.get('GITHUB_REPOSITORY','')}/blob/main/CHANGELOG.md" },
                { "type": "button", "text": { "type": "plain_text", "text": "View Diff" }, "url": args.diff_url }
            ]
        },
        {
            "type": "context",
            "elements": [{ "type": "mrkdwn", "text": f"Inscribed by the Strategist • {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}" }]
        }
    ]
}

resp = requests.post(SLACK_WEBHOOK_URL, json=payload)
if resp.status_code != 200:
    print(f'Slack broadcast failed: {resp.status_code} {resp.text}')
    sys.exit(1)
else:
    print('Slack broadcast sent successfully.')
