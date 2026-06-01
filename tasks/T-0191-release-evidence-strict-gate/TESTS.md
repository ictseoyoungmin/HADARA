# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker | Included in `npm run dev:docker-sync-build`; 79 files / 547 tests passed. |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker | `npm run dev:docker-sync-build` ran build, tests, and built CLI smoke. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Built CLI version smoke | Yes | Confirms `/workspace/dist` is fresh after Docker build. | Passed | `version --verbose --json` returned `ok:true`, `distLooksStale:false`. |
