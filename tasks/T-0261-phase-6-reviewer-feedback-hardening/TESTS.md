# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused wrapper | Run focused unit/schema/docs coverage through the official wrapper. | Yes | Passed | `node dist/cli/main.js dev docker-check --focused tests/unit/dev-docker-check.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-workflow-docs.test.ts --json` returned `ok:true`. |
| Docker sync-build | Run full Docker validation and refresh workspace `dist`. | Yes | Passed | `npm run dev:docker-sync-build` passed 100 files / 661 tests and refreshed built output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused workflow tests | Yes | Template expected evidence. | Passed | Covered `tests/unit/dev-docker-check.test.ts`, `tests/unit/schema-fixtures.test.ts`, and `tests/unit/task-workflow-docs.test.ts`. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 661 tests. |
| built CLI workflow smoke | Yes | Template expected evidence. | Passed | Built `dev docker-check --focused tests/unit/dev-docker-check.test.ts --sync-dist --json` returned `projectSourceMutation:false`, `outputMutation:true`, `beforeHashAvailable:true`, `requiresBeforeHash:false`, and `conflictDetected:false`. |
