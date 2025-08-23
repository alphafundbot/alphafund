import os
import sys
import json
import argparse
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple

try:
    import requests
except ImportError:
    print("The 'requests' package is required. Please install it with 'pip install requests'.")
    sys.exit(1)

DEFAULT_LABEL_FAMILIES = ["type", "scope", "domain", "cadence", "impact"]
LABELS_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "labels_config.json")

def load_label_families() -> List[str]:
    if os.path.exists(LABELS_CONFIG_PATH):
        with open(LABELS_CONFIG_PATH, encoding="utf-8") as f:
            config = json.load(f)
            families = config.get("families")
            if families:
                return families
    return DEFAULT_LABEL_FAMILIES.copy()

def parse_labels(labels: List[Dict[str, Any]], label_families: List[str]) -> Dict[str, List[str]]:
    parsed: Dict[str, List[str]] = {family: [] for family in label_families}
    for label in labels:
        name: str = str(label.get("name", "")).strip().lower()
        if ":" not in name:
            continue
        family, value = name.split(":", 1)
        family = family.strip()
        value = value.strip()
        if family in parsed and value and value not in parsed[family]:
            parsed[family].append(value)
    return parsed

def get_merged_prs_for_tag(
    tag: str,
    api_url: str,
    headers: Dict[str, str],
    verbose: bool = False
) -> List[Dict[str, Any]]:
    r = requests.get(f"{api_url}/git/refs/tags/{tag}", headers=headers)
    if r.status_code != 200:
        print(f"Tag {tag} not found.")
        sys.exit(1)
    tag_obj = r.json()
    tag_sha = tag_obj["object"]["sha"]
    r = requests.get(f"{api_url}/commits/{tag_sha}", headers=headers)
    if r.status_code != 200:
        print(f"Commit for tag {tag} not found.")
        sys.exit(1)
    commit = r.json()
    commit_date = commit["commit"]["committer"]["date"]
    prs: List[Dict[str, Any]] = []
    page = 1
    while True:
        r = requests.get(f"{api_url}/pulls?state=closed&sort=updated&direction=desc&per_page=100&page={page}", headers=headers)
        if r.status_code != 200:
            break
        page_prs = r.json()
        if not page_prs:
            break
        for pr in page_prs:
            if pr["merged_at"] and pr["merged_at"] <= commit_date:
                prs.append(pr)
        if len(page_prs) < 100:
            break
        page += 1
    if verbose:
        print(f"Fetched {len(prs)} merged PRs for tag {tag}")
    return prs

def lint_labels(parsed_labels: Dict[str, List[str]], pr_number: int) -> List[str]:
    errors: List[str] = []
    for family in ["type", "scope", "domain"]:
        if not parsed_labels.get(family):
            errors.append(f"PR #{pr_number} missing required label: {family}")
    for fam, vals in parsed_labels.items():
        for v in vals:
            if not v:
                errors.append(f"PR #{pr_number} has malformed label in {fam}")
    return errors

def generate_changelog(
    prs: List[Dict[str, Any]],
    label_families: List[str],
    verbose: bool = False
) -> Tuple[str, List[str]]:
    domain_groups: Dict[str, List[str]] = {}
    lint_errors: List[str] = []
    for pr in prs:
        pr_number: int = pr["number"]
        pr_title: str = pr["title"]
        pr_labels: Dict[str, List[str]] = parse_labels(pr["labels"], label_families)
        errors: List[str] = lint_labels(pr_labels, pr_number)
        if errors:
            lint_errors.extend(errors)
        domain: str = pr_labels["domain"][0] if pr_labels["domain"] else "unspecified"
        banner: str = " | ".join(
            f"{fam}:{'|'.join(pr_labels[fam])}" for fam in label_families if pr_labels[fam]
        )
        entry: str = f"### {banner}\n- PR #{pr_number} — {pr_title}"
        domain_groups.setdefault(domain, []).append(entry)
    date_str: str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    changelog: str = f"\n## [Release $RELEASE_TAG] — {date_str}\n\n"
    for domain, entries in domain_groups.items():
        for entry in entries:
            changelog += entry + "\n\n"
    return changelog, lint_errors

def write_changelog(changelog: str, path: str, verbose: bool = False) -> None:
    with open(path, "a", encoding="utf-8") as f:
        f.write(changelog)
    if verbose:
        print(f"Changelog written to {path}")

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate changelog for a release tag.")
    parser.add_argument("--dry-run", action="store_true", help="Print changelog instead of writing to file.")
    parser.add_argument("--verbose", action="store_true", help="Verbose output.")
    parser.add_argument("--tag", default=os.environ.get("RELEASE_TAG"), help="Release tag to use.")
    parser.add_argument("--changelog-path", default=os.environ.get("CHANGELOG_PATH", "CHANGELOG.md"), help="Changelog file path.")
    parser.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY"), help="GitHub repository.")
    parser.add_argument("--token", default=os.environ.get("GITHUB_TOKEN"), help="GitHub token.")
    args = parser.parse_args()

    if not (args.tag and args.repo and args.token):
        print("Missing required arguments or environment variables.")
        sys.exit(1)

    label_families: List[str] = load_label_families()
    headers: Dict[str, str] = {"Authorization": f"token {args.token}", "Accept": "application/vnd.github.v3+json"}
    api_url: str = f"https://api.github.com/repos/{args.repo}"
    prs: List[Dict[str, Any]] = get_merged_prs_for_tag(args.tag, api_url, headers, args.verbose)
    changelog: str
    lint_errors: List[str]
    changelog, lint_errors = generate_changelog(prs, label_families, args.verbose)
    if lint_errors:
        print("\n".join(lint_errors))
        sys.exit(1)
    if args.dry_run:
        print(changelog)
    else:
        write_changelog(changelog, args.changelog_path, args.verbose)

if __name__ == "__main__":
    main()
