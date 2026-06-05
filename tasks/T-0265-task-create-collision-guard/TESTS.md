# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --focused tests/unit/task-create.test.ts tests/unit/schema-fixtures.test.ts --json` | Run focused task-create and schema tests in Docker temp copy. | Yes | Passed | Focused Docker wrapper passed after schema edge cleanup. |
| `npm run dev:docker-sync-build` | Run full repository check and refresh workspace `dist`. | Yes | Passed | Docker sync-build passed 100 files / 673 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused task-create/schema tests | Yes | T-0265 behavior coverage. | Passed | Focused Docker wrapper passed. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 673 tests. |
| built task-create CLI smoke | Yes | T-0265 built CLI evidence. | Passed | Built task-create smoke in `/tmp/hadara-t0265-smoke-6lPlM9` returned `ok:true` and created T-0001. |
