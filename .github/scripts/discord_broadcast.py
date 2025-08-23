import os
import json
import requests
from pathlib import Path

LABELS_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "labels_config.json")
labels_config = json.loads(Path(LABELS_CONFIG_PATH).read_text())

def render_banner(labels):
    parts = []
    for family, values in labels.items():
        for value in values:
            icon = labels_config.get(family, {}).get(value, {}).get("icon", "")
            parts.append(f"{icon} {family}:{value}")
    return " | ".join(parts)

def build_message(release_tag, highlights):
    banner = render_banner(highlights[0]["labels"])
    lines = [f"\U0001F4DC **Release {release_tag} — {banner}**", "**Changelog Highlights:**"]
    for h in highlights:
        lines.append(f"• PR #{h['pr']} — {h['title']}")
    lines.append(f"[View Full Changelog]({highlights[0]['changelog_url']}) | [View Diff]({highlights[0]['diff_url']})")
    return "\n".join(lines)

if __name__ == "__main__":
    webhook_url = os.environ["DISCORD_WEBHOOK_URL"]
    # Example highlights data; in production, parse from changelog or pass as input
    highlights = [
        {"pr": 123, "title": "Add streaming telemetry endpoint", "labels": {"type": ["feature"], "scope": ["api"], "domain": ["infra"]},
         "changelog_url": "https://github.com/org/repo/blob/main/CHANGELOG.md",
         "diff_url": "https://github.com/org/repo/compare/v2.2.0...v2.3.0"}
    ]
    payload = {"content": build_message(os.environ["RELEASE_TAG"], highlights)}
    r = requests.post(webhook_url, json=payload)
    r.raise_for_status()
