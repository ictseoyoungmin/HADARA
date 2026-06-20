# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused validation for task-finalize and lifecycle adjacency tests. | Validate new read model, CLI route, schemas, docs, and nearby lifecycle behavior. | Yes | Passed: 7 files / 37 tests. | `ev:T-0396:874095dd00434f5195eb144a` |
| `npm run dev:docker-sync-build` | Full HADARA-dev Docker validation and workspace `dist` refresh. | Yes | Passed: 141 files / 925 tests; `distLooksStale:false`. | `ev:T-0396:1057e733697c467aa0fbc9cd` |
| Built CLI `task finalize --task T-0396 --json` smoke. | Verify built command returns schema, read-only dry-run plan, plan hash, and finish-required step. | Yes | Passed. | `ev:T-0396:d7b3975a5e4849f9ab74da22` |
| Built CLI `task finalize --task T-0396 --execute --json` smoke. | Verify execute path refuses writes without reviewed plan hash. | Yes | Passed with `TASK_FINALIZE_PLAN_HASH_REQUIRED`. | `ev:T-0396:7d3e8d90a33149be8a8e2e94` |
| `git diff --check` | Verify whitespace cleanliness. | Yes | Passed. | `ev:T-0396:c1bb5501c5d8471f81406164` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, raw-read, or execution boundary expansion was added. | Not Run | Not applicable. |
| Integration smoke | Yes | CLI route is a new public command surface. | Passed | `ev:T-0396:d7b3975a5e4849f9ab74da22`, `ev:T-0396:7d3e8d90a33149be8a8e2e94` |
