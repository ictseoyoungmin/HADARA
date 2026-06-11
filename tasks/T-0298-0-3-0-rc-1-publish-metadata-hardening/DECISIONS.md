# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Publish helper must prefer repository `dist/cli/main.js` over global `hadara`. | Accepted | Release artifact generation should use the same committed/built code being published, not an older installed command. | `scripts/release/manual-publish-rc.sh` |
| D-2 | Tarball `package/package.json` metadata is a blocking pre-publish check. | Accepted | Registry metadata follows tarball/package metadata; checking before dry-run prevents repeating the rc.0 metadata miss. | `scripts/release/manual-publish-rc.sh`; `tests/unit/manual-publish-script.test.ts` |
