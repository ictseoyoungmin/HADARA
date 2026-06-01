# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| node --check scripts/dashboard-playwright-performance.mjs | Syntax-check measurement script. | Yes | Passed | Host Node check passed. |
| Playwright Docker measurement command | Measure dashboard shell/API route timings. | Yes | Passed | Report generated at `docs/DASHBOARD_PERFORMANCE_MEASUREMENT.md`. |
| npm run dev:docker-sync-build | Full Docker validation and workspace `dist` refresh. | Yes | Passed: 84 files / 562 tests | Docker sync-build passed and built CLI smoke returned `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
