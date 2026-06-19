# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/session-start.test.ts tests/unit/context-graph-cli.test.ts tests/unit/schema-fixtures.test.ts` | Focused Session Start, CLI, and schema coverage. | Yes | Failed on host; `vitest` not installed. | Recorded in `ev:T-0382:93c876280718445e833270ba`; Docker focused path passed. |
| `docker exec hadara-dev ... /tmp/hadara ... npm run test:focused -- tests/unit/session-start.test.ts tests/unit/context-graph-cli.test.ts tests/unit/schema-fixtures.test.ts` | Docker focused validation baseline for changed runtime/schema tests. | Yes | Passed: 3 files / 20 tests. | `ev:T-0382:93c876280718445e833270ba` |
| `npm run dev:docker-check` | Full Docker check without dist sync. | No | Failed once due unrelated `tui-snapshot` timeout; changed Session Start tests passed before failure. | Rerun through `dev:docker-sync-build` passed. |
| `npm run dev:docker-sync-build` | Full Docker validation and workspace `dist` refresh for runtime changes. | Yes | Passed: 136 files / 898 tests; `distLooksStale:false`. | `ev:T-0382:93c876280718445e833270ba` |
| Built CLI session-start smokes | Verify default no-task and task-scoped JSON from refreshed `dist`. | Yes | Passed: both returned `ok:true` with expected `guidance`. | `ev:T-0382:93c876280718445e833270ba` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | Not applicable; this only changes Session Start JSON guidance. |
| Integration smoke | No | Only if integration surface changes. | Not Run | Not applicable beyond built CLI smokes above. |
