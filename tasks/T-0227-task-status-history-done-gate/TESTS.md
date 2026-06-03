# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/markdown-table.test.ts tests/unit/task-finish.test.ts tests/harness/harness-validate.test.ts tests/unit/task-upgrade-scaffold.test.ts tests/unit/protocol-consistency.test.ts tests/unit/protocol-remediation.test.ts tests/unit/dashboard-bootstrap.test.ts` | Focused shared section reader, finish, harness, protocol, and affected read-model coverage. | Yes | Passed | Docker focused tests passed 7 files / 74 tests. |
| `npm run test:focused -- tests/unit/task-finish.test.ts tests/harness/harness-validate.test.ts tests/harness/dogfooding-e2e-fixture.test.ts tests/unit/dashboard-bootstrap.test.ts` | Focused finish/harness regression coverage plus affected fixtures. | Yes | Passed | Final Docker focused tests passed 4 files / 33 passed, 1 skipped. |
| `npm run dev:docker-sync-build` | Docker full check/build and workspace `dist` refresh. | Yes | Passed | Shared section reader final pass: 91 files / 595 tests; built CLI smoke `ok:true`, `distLooksStale:false`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
