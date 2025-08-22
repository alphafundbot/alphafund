# Code Citations

## License: MIT
https://github.com/Uvacoder/what-if-grid/tree/5ecb22fa006fad29abafe356bc95e1a929069d97/notes/snippets/2020-10-07-github-actions.md

```
with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
```


## License: unknown
https://github.com/RomainFallet/symfony-starter/tree/e041c5f59bc169e5a9aa071981b7cca7108235a1/README.md

```
.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run
```


## License: unknown
https://github.com/gmlwo530/blog2/tree/12fe34a8e5aa073817101f0ab29955adac9dade7/content/posts/2021/GitHub-Actions-React-Deploy.md

```
: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm install
```

---

## License Summary

| Source | License | Notes |
|--------|---------|-------|
| [Uvacoder GitHub Actions Snippet](https://github.com/Uvacoder/what-if-grid/tree/5ecb22fa006fad29abafe356bc95e1a929069d97/notes/snippets/2020-10-07-github-actions.md) | MIT | ✅ Safe to reuse with attribution |
| [RomainFallet Symfony Starter README](https://github.com/RomainFallet/symfony-starter/tree/e041c5f59bc169e5a9aa071981b7cca7108235a1/README.md) | Unknown | ⚠️ License not specified — use cautiously or seek clarification |
| [gmlwo530 GitHub Actions React Deploy](https://github.com/gmlwo530/blog2/tree/12fe34a8e5aa073817101f0ab29955adac9dade7/content/posts/2021/GitHub-Actions-React-Deploy.md) | Unknown | ⚠️ License not specified — use cautiously or seek clarification |

---

## Next Steps

- MIT-licensed: Free to use/modify/distribute with attribution.
- Unknown license: Seek clarification or treat as proprietary.
- Consider adding a `third_party_licenses.md` for ongoing attribution tracking.

