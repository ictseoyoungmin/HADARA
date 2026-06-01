# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-timeline.test.ts tests/unit/dashboard-task-detail.test.ts tests/unit/dashboard-static.test.ts | Focused timeline identity and dashboard consumer regression coverage. | Yes | Passed: 3 files / 16 tests | Docker temp-copy command passed. |
| npm run dev:docker-sync-build | Full Docker validation and workspace `dist` refresh. | Yes | Passed: 82 files / 557 tests | Docker sync-build passed and built CLI smoke returned `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
