# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-v2-plan-docs.test.ts` | Validate v2 writer/migration plan docs. | Yes | Passed: 1 file / 1 test. | T-0190 focused evidence record. |
| `npm run dev:docker-sync-build` | Full Docker validation and build refresh. | Yes | Passed: 79 files / 546 tests; built CLI smoke ok. | T-0190 Docker sync-build evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Migration command smoke | No | Migration command is not implemented in this design capsule. | Not Run | Deferred. |
| Writer smoke | No | v2 writer is not implemented in this design capsule. | Not Run | Deferred. |
