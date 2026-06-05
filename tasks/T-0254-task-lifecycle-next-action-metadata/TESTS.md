# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/task-finish.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` | Validate lifecycle actor/next-action metadata and schema compatibility. | Yes | Passed in Docker: 5 files / 38 tests. | `EVIDENCE.md` validation record. |
| `npm run dev:docker-sync-build` | Run full Docker build/test check, refresh workspace `dist`, and smoke built CLI. | Yes | Passed in Docker: 93 files / 632 tests; built CLI version smoke `ok:true`, `distLooksStale:false`. | `EVIDENCE.md` validation record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secret, permission, storage, or execution boundary changed. | Not Run | Not required. |
| Integration smoke | No | No external integration surface changed. | Not Run | Not required. |
