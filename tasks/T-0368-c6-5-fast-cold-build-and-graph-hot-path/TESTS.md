# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed via Docker sync-build | `ev:T-0368:a2306de95f6b4741bf91c897` |
| npm run check | Run the full repository check when available. | Yes | Passed via Docker sync-build | `ev:T-0368:a2306de95f6b4741bf91c897` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, storage-boundary, or MCP write-surface change beyond local ignored cache metadata. | Not Required | N/A |
| Integration smoke | No | Docker full suite and graph/cache unit coverage exercise the changed read path. | Covered by full check | `ev:T-0368:a2306de95f6b4741bf91c897` |
