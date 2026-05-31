# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0183 evidence.jsonl |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0183 evidence.jsonl |
| npm run dev:docker-sync-build | Build/check in Docker, refresh workspace `dist`, and smoke runtime version. | Yes | Passed; 74 files / 516 tests; runtime version smoke returned `distLooksStale:false`. | T-0183 evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/focused-test-script.test.ts` | Yes | Proves selected-file Vitest invocation. | Passed; 1 file / 2 tests. | T-0183 evidence.jsonl |
| Security smoke | No | No permission, secret, provider, MCP, or execution boundary changed. | Not Run | Not required |
| Integration smoke | No | Package script/docs change covered by focused and full checks. | Not Run | Not required |
