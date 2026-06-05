# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed | Docker sync-build passed 100 files / 660 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed | Docker sync-build passed 100 files / 660 tests and refreshed `dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused release/schema tests | Yes | Template expected evidence. | Passed | Docker wrapper passed `release-dry-run`, `schema-runtime`, `release-target-configuration`, `release-provider-advisories`, and `release-readiness-summary` tests. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 660 tests. |
| built CLI dry-run smoke | Yes | Template expected evidence. | Passed | Built `release dry-run --json` returned `ok:true`, readiness `ready`, blockers 0, and publish/GitHub/Docker mutation flags false. |
