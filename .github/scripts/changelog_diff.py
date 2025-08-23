import sys
import re

version = sys.argv[1]
with open('CHANGELOG.md', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(rf'## \[{re.escape(version)}\](.*?)(?=^## |\Z)', re.DOTALL | re.MULTILINE)
match = pattern.search(content)
if match:
    print(match.group(1).strip())
else:
    print(f'No changelog section found for {version}')
