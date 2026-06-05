# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm test` | Run the default project test suite. | Yes | Passed in Docker sync-build | 100 files / 673 tests passed. |
| `npm run check` | Run the full repository check when available. | Yes | Passed in Docker sync-build | Build plus 100 files / 673 tests passed; dist refreshed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused finish/ready/close/audit tests | Yes | Template expected evidence. | Passed | Docker wrapper passed `tests/unit/task-finish.test.ts` and `tests/unit/schema-fixtures.test.ts`. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 673 tests and refreshed `dist`. |
| built lifecycle CLI smoke | Yes | Template expected evidence. | Passed | Built task create/finish smoke in `/tmp` returned finish `ok:true`, single newline EOF, and no trailing blank EOF. |
