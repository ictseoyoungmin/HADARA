# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/actor-context.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` | Validate Phase 6 context helpers and schema registration. | Yes | Passed in Docker: 3 files / 27 tests. | `EVIDENCE.md` validation record. |
| `npm run dev:docker-sync-build` | Run full Docker build/test check, refresh workspace `dist`, and smoke built CLI. | Yes | Passed in Docker: 93 files / 632 tests; built CLI version smoke `ok:true`, `distLooksStale:false`. | `EVIDENCE.md` validation record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secret, permission, execution, or storage boundary changed. | Not Run | Not required. |
| Integration smoke | No | No command behavior or external integration surface changed. | Not Run | Not required. |
