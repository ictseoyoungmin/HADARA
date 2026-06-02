# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- <contract/schema test>` | Validate schema/contract expectations for `hadara.dashboard.core.v1`. | Yes | Pending | TBD |
| `npm run dev:docker-sync-build` | Full Docker validation baseline if code/schema changes warrant it. | Yes | Pending | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Read-only boundary scan | Yes | Contract must not add shell/provider/MCP writes or browser storage. | Pending | TBD |
| Integration smoke | No | No route/frontend implementation in T-0216. | Not Run | N/A |
