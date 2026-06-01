# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run dev:docker-sync-build | Full Docker validation and workspace `dist` refresh. | Yes | Passed: 83 files / 561 tests | Docker sync-build passed and built CLI smoke returned `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
