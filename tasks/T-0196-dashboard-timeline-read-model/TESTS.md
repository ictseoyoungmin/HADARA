# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/dashboard-static.test.ts tests/unit/dashboard-timeline.test.ts | Run focused dashboard timeline/API/schema regressions. | Yes | Passed | Docker temp-copy focused run passed with 2 files / 14 tests. |
| npm run dev:docker-sync-build | Run the full Docker validation baseline and built CLI smoke. | Yes | Passed | Passed with 80 test files / 552 tests and built CLI version smoke `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Timeline schema smoke | Yes | New timeline schema must be registered and validate a generated report. | Passed | Covered by `tests/unit/dashboard-timeline.test.ts` and schema fixture tests. |
| Dashboard API route boundary smoke | Yes | `/api/timeline` must remain read-only GET/HEAD and safe. | Passed | Covered by `tests/unit/dashboard-static.test.ts`. |
