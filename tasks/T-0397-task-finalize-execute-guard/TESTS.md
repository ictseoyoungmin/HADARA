# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker temp-copy focused validation for finalize/close/lifecycle/schema tests. | Validate guarded execute, adjacent lifecycle writers, and schema fixtures. | Yes | Passed: 4 files / 21 tests. | `ev:T-0397:59085932aced47be89c4532d` |
| `npm run dev:docker-sync-build` | Full repository Docker validation and workspace `dist` refresh. | Yes | Passed: 141 files / 928 tests; `distLooksStale:false`. | `ev:T-0397:fd38f35a791e4b179285cc9d` |
| Built CLI finalize dry-run smoke. | Verify current built CLI exposes execute-supported plan hashes. | Yes | Passed. | `ev:T-0397:924236021b714ecaa783c7ec` |
| Built CLI finalize execute guard smokes. | Verify missing/stale plan hashes are refused without writes. | Yes | Passed with `TASK_FINALIZE_PLAN_HASH_REQUIRED` and `TASK_FINALIZE_PLAN_HASH_MISMATCH`. | `ev:T-0397:454daf3e664843cba5db3b1a` |
| `git diff --check` | Verify whitespace cleanliness. | Yes | Passed. | `ev:T-0397:3436c55fab2344789c6183b9` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secret, permission, provider, or raw file boundary changed. | Not Run | Not applicable. |
| Integration smoke | Yes | New guarded execute CLI path. | Passed | `ev:T-0397:454daf3e664843cba5db3b1a`; final dogfood close uses `task finalize --execute --plan-hash`. |
