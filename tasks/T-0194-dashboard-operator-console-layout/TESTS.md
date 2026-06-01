# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-static.test.ts | Run focused dashboard live/layout/static regressions. | Yes | Passed | Docker temp-copy focused run passed with 1 file / 13 tests. |
| npm run dev:docker-sync-build | Run the full Docker validation baseline and built CLI smoke. | Yes | Passed | Passed with 79 test files / 551 tests and built CLI version smoke `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Forbidden-label scan | Yes | T-0194 must not imply run/sync/finish/close/publish/mutation actions. | Passed | Covered by focused dashboard test. |
| Responsive layout smoke | Yes | Static tests should assert responsive CSS and required layout landmarks exist. | Passed | Covered by focused dashboard test. |
