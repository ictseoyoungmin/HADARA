# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --focused tests/unit/dev-docker-check.test.ts tests/unit/schema-fixtures.test.ts --json` | Run focused dev docker-check/schema tests. | Yes | Passed | Docker wrapper passed focused mode. |
| `npm run dev:docker-sync-build` | Run full repository check and refresh workspace `dist`. | Yes | Passed | Docker sync-build passed 100 files / 669 tests and built version smoke returned `distLooksStale:false`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| focused workflow tests | Yes | Template expected evidence. | Passed | Focused wrapper covered `tests/unit/dev-docker-check.test.ts` and `tests/unit/schema-fixtures.test.ts`. |
| full Docker check | Yes | Template expected evidence. | Passed | Docker sync-build passed 100 files / 669 tests. |
| built CLI workflow smoke | Yes | Template expected evidence. | Passed | Built `dev docker-check --sync-dist --before-hash ...` executed sync; built no-hash smoke returned conflict and no output mutation. |
