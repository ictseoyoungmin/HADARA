# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker | ev:T-0367:3ea9270b38914be8af628ee0 |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker | ev:T-0367:3ea9270b38914be8af628ee0 |
| npm run dev:docker-sync-build | Refresh `dist` from Docker build output and run built CLI smoke. | Yes | Passed | ev:T-0367:b39db4c678314b00bedc1075 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built cache warm dry-run | Yes | New `context cache warm` report fields and shard plans must work through built CLI. | Passed | ev:T-0367:5c992744d9874413b60f34ea |
| Security smoke | No | No secrets, permissions, MCP, or execution boundary changes. | Not Run | Not required |
| Integration smoke | No | Unit/CLI coverage plus built dry-run cover this local cache surface. | Not Run | Not required |
