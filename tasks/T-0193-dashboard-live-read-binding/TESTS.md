# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-static.test.ts | Run focused dashboard static/live-binding regressions. | Yes | Passed | Docker temp-copy focused run passed with 1 file / 12 tests. |
| npm run dev:docker-sync-build | Run the full Docker validation baseline and refresh built CLI output. | Yes | Passed | Passed with 79 test files / 550 tests and built CLI version smoke `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Dashboard route boundary smoke | Yes | Existing tests cover GET/HEAD/static API boundaries and must remain green. | Passed | Covered by `dashboard-static.test.ts` focused run. |
| Browser/manual visual smoke | No | T-0193 changes binding and provenance but does not require a visual redesign; focused HTML tests cover labels. | Not Run | TBD |
