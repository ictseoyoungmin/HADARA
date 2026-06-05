# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --focused tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts --json` | Run focused close/audit and schema tests in Docker temp copy. | Yes | Passed | Focused Docker wrapper passed. |
| `npm run dev:docker-sync-build` | Run full repository check and refresh workspace `dist`. | Yes | Passed | Docker sync-build passed 100 files / 670 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused finish/ready/close/audit tests | Yes | Template expected evidence. | Passed | Focused wrapper covered `tests/unit/task-close.test.ts`. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 670 tests. |
| built lifecycle CLI smoke | Yes | Template expected evidence. | Passed | Built `task finish --execute`, `task ready --level done`, `task close --execute`, and `task audit-close` passed; close execute showed `executeRecheck.performed:true`. |
