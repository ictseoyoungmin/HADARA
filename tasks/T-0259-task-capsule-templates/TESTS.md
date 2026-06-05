# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed | Covered inside Docker sync-build: 97 files / 651 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed | `npm run dev:docker-sync-build` ran build + tests and refreshed `dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Focused task-create validation | Yes | Confirms templates/schema/title parsing before full validation. | Passed | `dev docker-check --focused tests/unit/task-create.test.ts tests/unit/task-json.test.ts tests/unit/schema-fixtures.test.ts --json` returned `ok:true`. |
| Built release template smoke | Yes | Confirms refreshed `dist` creates template capsules in a temp project. | Passed | Built CLI returned `hadara.task.create.v1`, `template.id: release-read-model`. |
| Built unknown-template smoke | Yes | Confirms clear failure and supported template list. | Passed | Built CLI exited 6 with `TASK_TEMPLATE_UNKNOWN`. |
| Security smoke | No | No secrets, storage, or permission boundaries changed. | Not Run | Not required. |
| Integration smoke | No | No MCP/provider/dashboard integration changed. | Not Run | Not required. |
