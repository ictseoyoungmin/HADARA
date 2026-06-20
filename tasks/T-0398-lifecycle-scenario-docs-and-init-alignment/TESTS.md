# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused validation for init/workflow/registry/schema docs | Verify generated init docs, task workflow docs, command registry, and schema fixtures after guidance changes. | Yes | Passed: 4 files / 34 tests. | `ev:T-0398:7226b21db0564b008a4a8dc3`, `ev:T-0398:d69e62e8e4254bebbfd5d89b` |
| npm run dev:docker-sync-build | Run the full Docker validation/build baseline and refresh `dist`. | Yes | Passed: 141 files / 928 tests; `distLooksStale:false`. | `ev:T-0398:1d161be5bec2445292c76cb5`, `ev:T-0398:d69e62e8e4254bebbfd5d89b` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built command registry smoke | Yes | Confirm built CLI exposes documented `task.finalize` dry-run and guarded execute examples. | Passed. | `ev:T-0398:9f630cc9e133415495f689c2` |
| git diff --check | Yes | Check whitespace and patch hygiene. | Passed. | `ev:T-0398:ee6a84b8d9274c308c94d564`, `ev:T-0398:e0be2ec555684f0a9e12b8df`, `ev:T-0398:d69e62e8e4254bebbfd5d89b` |
