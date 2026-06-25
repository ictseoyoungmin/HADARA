# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused build/tests | Validate package/readme/init/release-doc changes and refresh dist. | Yes | Not Run | TBD |
| Built CLI version smoke | Confirm built CLI reports `packageVersion=0.3.4-rc.0`. | Yes | Not Run | TBD |
| Release dry-run/readiness smoke | Confirm source readiness without publish mutation. | Yes | Not Run | TBD |
| git diff --check | Catch whitespace errors. | Yes | Not Run | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Approval-gated follow-up capsule only. | Not Run | Out of scope |
| GitHub Release draft | No | Secondary target; approval-gated follow-up only. | Not Run | Out of scope |
