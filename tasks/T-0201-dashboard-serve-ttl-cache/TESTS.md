# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-cache.test.ts tests/unit/dashboard-bootstrap.test.ts tests/unit/dashboard-task-detail.test.ts tests/unit/dashboard-timeline.test.ts tests/unit/dashboard-static.test.ts | Focused dashboard cache and aggregate route coverage. | Yes | Not Run on host | Host `vitest` is unavailable because host `node_modules` is absent. |
| npm run dev:docker-sync-build | Full Docker validation and workspace `dist` refresh. | Yes | Passed: 83 files / 560 tests | Docker sync-build passed and built CLI smoke returned `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
