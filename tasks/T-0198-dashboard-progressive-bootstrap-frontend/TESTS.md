# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-static.test.ts tests/unit/dashboard-bootstrap.test.ts | Focused dashboard frontend/bootstrap regression coverage. | Yes | Passed: 2 files / 16 tests | Docker temp-copy command passed. |
| npm run dev:docker-sync-build | Full Docker validation and workspace `dist` refresh. | Yes | Passed: 81 files / 555 tests | Built CLI version smoke returned `ok:true`, `distLooksStale:false`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
