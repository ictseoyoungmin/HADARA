# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/schema-fixtures.test.ts tests/unit/dashboard-core-contract.test.ts` | Validate schema/contract expectations for `hadara.dashboard.core.v1`. | Yes | Passed in Docker `/tmp/hadara`: 2 files / 3 tests. | `evidence.jsonl` |
| `npm run dev:docker-sync-build` | Full Docker validation baseline if code/schema changes warrant it. | Yes | Passed: 85 files / 564 tests; built CLI smoke `ok:true`. | `evidence.jsonl` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Read-only boundary scan | Yes | Contract must not add shell/provider/MCP writes or browser storage. | Passed by scope/files: no route/frontend/write implementation added. | `FILES.md` |
| Integration smoke | No | No route/frontend implementation in T-0216. | Not Run | N/A |
