import sys
import re

changelog_path = sys.argv[1]
with open(changelog_path, encoding='utf-8') as f:
    content = f.read()

# Ensure Unreleased section exists
if '## [Unreleased]' not in content:
    print('Missing [Unreleased] section in changelog.')
    sys.exit(1)

# Validate entry format (simple YAML/Markdown style)
entry_pattern = re.compile(r'- (feat|fix|docs|chore|refactor|test)(\([^)]+\))?: .+')
for line in content.splitlines():
    if line.startswith('- '):
        if not entry_pattern.match(line):
            print(f'Invalid changelog entry format: {line}')
            sys.exit(1)
