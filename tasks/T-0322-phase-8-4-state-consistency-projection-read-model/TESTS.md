# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/state-projection.test.ts tests/unit/schema-fixtures.test.ts` | Validate projection behavior and schema registration. | Yes | Passed: focused Docker validation passed 2 files / 4 tests after TypeScript build. | `command:T-0322:focused-state-projection` |
| `npm run dev:docker-sync-build` | Run full Docker-backed check and refresh workspace `dist`. | Yes | Passed: 119 files / 775 tests; workspace `dist` refreshed; runtime version smoke reported `distLooksStale:false`. | `command:T-0322:full-docker-sync-build` |
| `git diff --check` | Check patch hygiene. | Yes | Passed. | `command:T-0322:repo-state-projection-smoke` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built state projection smoke | Yes | Service is not exposed by CLI yet, but built `dist` should load the report. | Passed: current repo projection completed in 5844ms with warning-only existing drift. | `command:T-0322:repo-state-projection-smoke` |
| CLI smoke | No | T-0322 is service/schema only; CLI exposure is T-0323/Phase 8.5. | Not Run | `DECISIONS.md` D-1 |
