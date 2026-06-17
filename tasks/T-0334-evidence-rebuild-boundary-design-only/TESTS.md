# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run dev:docker-sync-build | Validate source-string documentation changes, full suite, and refreshed `dist`. | Yes | Passed: 119 files / 791 tests; `distLooksStale:false`. | `ev:T-0334:53c907c3c7fd4d82a2599677` |
| git diff --check | Verify documentation patches do not introduce whitespace errors. | Yes | Passed: exit 0. | `ev:T-0334:b51d191d6ace445da1040d01` |
| node dist/cli/main.js task ready --task T-0334 --level done --json | Verify done-level capsule and protocol readiness after finish. | Yes | Not Run | Run after `task finish --execute`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Runtime command smoke for `evidence rebuild` | No | T-0334 intentionally does not add command behavior. | Not Run | Out of scope by design. |
