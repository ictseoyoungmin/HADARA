# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `find docs/specs/rc3-proof-reliability -maxdepth 1 -type f -name '*.md' -print` | Confirm expected spec docs exist. | Yes | Passed | Five Markdown spec files were listed. |
| `git diff --check` | Check documentation changes for whitespace errors. | Yes | Passed | No output; exit 0. |
| `hadara task ready --task T-0283 --level done --json` | Done-level readiness after template wording fix. | Yes | Passed | Final run returned `ok:true`, blockers 0, warnings 0 after resolving the earlier failed evidence. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
