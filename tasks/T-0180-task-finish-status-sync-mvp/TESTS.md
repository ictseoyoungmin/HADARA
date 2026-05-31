# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0180 evidence.jsonl |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0180 evidence.jsonl |
| npm run dev:docker-sync-build | Build/check in Docker, refresh workspace `dist`, and smoke runtime version. | Yes | Passed; 71 files / 509 tests; runtime version smoke returned `distLooksStale:false`. | T-0180 evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task finish smoke | Yes | Confirms workspace `dist` exposes the new command after Docker sync-build. | Passed for dry-run and execute. | T-0180 evidence.jsonl |
| Security smoke | No | No permission, secret, provider, or MCP boundary changed. | Not Run | Not required |
| Integration smoke | No | CLI/service/schema change covered by unit and built CLI smoke. | Not Run | Not required |
