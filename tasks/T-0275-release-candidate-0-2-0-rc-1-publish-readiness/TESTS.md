# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused release/schema tests | Run focused release/package/schema coverage in the reusable Docker flow. | Yes | Not Run | TBD |
| Docker full sync-build | Run full build/test and refresh workspace `dist`. | Yes | Not Run | TBD |
| Built CLI release/package smokes | Verify the built CLI emits rc.1 release/package readiness reports without publish mutation. | Yes | Not Run | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `bash -n scripts/release/manual-publish-rc.sh` | Yes | Operator will use this helper after npm login. | Not Run | TBD |
| `git diff --check` | Yes | Catch whitespace issues before release artifact generation. | Not Run | TBD |
| `hadara package smoke --execute --attach-evidence --task T-0275 --json` | Yes | Fresh package-smoke evidence for rc.1. | Not Run | TBD |
| `hadara smoke clean-checkout --execute --attach-evidence --task T-0275 --json` | Yes | Fresh clean-checkout evidence for rc.1. | Not Run | TBD |
| `hadara release artifact --execute --attach-evidence --task T-0275 --json` | Yes | Fresh release artifact evidence for the current source state. | Not Run | TBD |
| `hadara release dry-run --json` | Yes | Confirms strict release readiness without mutation. | Not Run | TBD |
| `hadara release publish --mode dry-run --approval-actor local-operator --approval-reason "T-0275 rc.1 publish readiness verification only" --json` | Yes | Confirms approval-gated publish readiness without mutation. | Not Run | TBD |
| npm login / npm publish | No | Operator-only final mutation. | Not Run | Must be run by the operator after reviewing and committing this capsule. |
