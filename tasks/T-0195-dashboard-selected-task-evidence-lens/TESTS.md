# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-static.test.ts | Run focused dashboard selected-task/API/proof regressions. | Yes | Passed | Docker temp-copy focused run passed with 1 file / 13 tests. |
| npm run dev:docker-sync-build | Run the full Docker validation baseline and built CLI smoke. | Yes | Passed | Passed with 79 test files / 551 tests and built CLI version smoke `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Dashboard API route boundary smoke | Yes | New workbench/evidence-lint routes must remain GET/HEAD read-only and safe on missing taskId. | Passed | Covered by focused dashboard test. |
| Proof status priority smoke | Yes | Dashboard must treat private-only as warning and failed/blocked/weak as blockers. | Passed | Covered by focused dashboard test string assertions. |
