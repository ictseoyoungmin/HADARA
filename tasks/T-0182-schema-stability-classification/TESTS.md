# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0182 evidence.jsonl |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0182 evidence.jsonl |
| npm run dev:docker-sync-build | Build/check in Docker, refresh workspace `dist`, and smoke runtime version. | Yes | Passed; 73 files / 514 tests; runtime version smoke returned `distLooksStale:false`. | T-0182 evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Schema stability docs focused test | Yes | Verifies docs and workbench schema annotation stay aligned. | Passed in Docker. | T-0182 evidence.jsonl |
| Security smoke | No | No permission, secret, provider, MCP, or execution boundary changed. | Not Run | Not required |
| Integration smoke | No | Documentation/schema metadata change covered by unit and full check. | Not Run | Not required |
