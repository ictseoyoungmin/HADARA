# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-task-projection.test.ts tests/unit/dashboard-static.test.ts | Focused backend/frontend projection refresh regressions. | Yes | Passed: 3 files / 22 tests in Docker `/tmp/hadara`. | 2026-06-03 focused Docker run. |
| npm run dashboard:build | Rebuild served dashboard bundle after frontend source changes. | Yes | Passed in Docker `/tmp/hadara`; copied `docs/design/dashboard/index.html` to workspace. | 2026-06-03 dashboard build. |
| npm run dev:docker-sync-build | Full Docker sync/build/test and refresh workspace `dist`. | Yes | Passed: 90 files / 591 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | 2026-06-03 full Docker sync-build. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built dashboard route smoke | Yes | Verify built `dist` exposes progress fields and core remains non-blocking during refresh. | Passed: `/api/dashboard/core` returned stale/pending during refresh; polling observed `currentStage: task-signals`, `processed:25`, `total:225`, and `lastYieldAt`. | 2026-06-03 built route smoke. |
| Security smoke | No | Browser remains read-only; no new secret/storage boundary intended. | Not Run | TBD |
| Visual/a11y gate | No | Required only if layout changes materially; this slice should keep compact status text only. | Not Run | TBD |
