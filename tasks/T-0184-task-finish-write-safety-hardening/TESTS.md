# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0184 evidence.jsonl |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`. | T-0184 evidence.jsonl |
| npm run dev:docker-sync-build | Build/check in Docker, refresh workspace `dist`, and smoke runtime version. | Yes | Passed; 74 files / 518 tests; runtime version smoke returned `distLooksStale:false`. | T-0184 evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Focused task finish/next unit coverage | Yes | Covers requested write-safety and quoting feedback. | Passed in Docker full check. | T-0184 evidence.jsonl |
| Built CLI task finish dry-run smoke | Yes | Confirms workspace `dist` exposes write hash metadata. | Passed; planned write included `expectedBeforeHash` and `afterHash`. | T-0184 evidence.jsonl |
| Security smoke | No | No secret/provider/MCP boundary changed; filesystem write hardening only. | Not Run | Not required |
| Integration smoke | No | CLI/service behavior covered by unit and built CLI smoke. | Not Run | Not required |
