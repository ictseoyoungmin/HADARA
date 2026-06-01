# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-semantic-contract-docs.test.ts` | Validate Dashboard/TUI semantic contract docs. | Yes | Passed: 1 file / 1 test. | T-0189 focused evidence record. |
| `npm run dev:docker-sync-build` | Full Docker validation and build refresh. | Yes | Passed: 78 files / 545 tests; built CLI smoke ok. | T-0189 Docker sync-build evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Dashboard UI smoke | No | No UI rendering in this contract slice. | Not Run | Deferred. |
| TUI snapshot smoke | No | No TUI rendering changes in this contract slice. | Not Run | Deferred. |
