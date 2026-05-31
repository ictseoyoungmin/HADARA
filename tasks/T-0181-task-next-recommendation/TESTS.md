# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0181 evidence.jsonl |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0181 evidence.jsonl |
| npm run dev:docker-sync-build | Build/check in Docker, refresh workspace `dist`, and smoke runtime version. | Yes | Passed; 72 files / 513 tests; runtime version smoke returned `distLooksStale:false`. | T-0181 evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task next smoke | Yes | Confirms workspace `dist` exposes the new read-only command. | Passed; returned `hadara.task.next.v1`. | T-0181 evidence.jsonl |
| Security smoke | No | No permission, secret, provider, MCP, or execution boundary changed. | Not Run | Not required |
| Integration smoke | No | CLI/service/schema change covered by unit and built CLI smoke. | Not Run | Not required |
