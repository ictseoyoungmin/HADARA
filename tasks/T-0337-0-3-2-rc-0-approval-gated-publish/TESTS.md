# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Check whitespace in capsule/shared-doc setup edits. | No | Passed | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| `node dist/cli/main.js task status --task T-0337 --json` | Confirm task status report generates and expected publish blockers remain. | No | Passed with expected in-progress blockers | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| `scripts/release/manual-publish-rc.sh T-0337` | Final validation, artifact/smoke evidence refresh, release gates, and npm publish dry-run without registry mutation. | Yes | Not Run | Operator handoff |
| `scripts/release/manual-publish-rc.sh T-0337 --execute` | Approval-gated npm publish after interactive confirmation. | Yes | Not Run | Operator handoff |
| `npm view hadara@0.3.2-rc.0 version --registry=https://registry.npmjs.org` | Verify published rc0 visibility. | Yes | Not Run | Pending publish |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `next` and `latest` tags. | Yes | Not Run | Pending publish |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Release draft | No | Only if explicitly requested. | Not Run | Out of default scope |
| Installed-package recycle | No | Owned by T-0338. | Not Run | Out of scope |
