# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed | Covered inside Docker sync-build: 96 files / 647 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed | `npm run dev:docker-sync-build` ran build + tests and refreshed `dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built wrapper smoke | Yes | Confirms refreshed workspace `dist` exposes the new Docker wrapper and can run a focused file with explicit dist sync. | Passed | `node dist/cli/main.js dev docker-check --focused tests/unit/dev-docker-check.test.ts --sync-dist --json` returned `ok:true`, `distSync.executed:true`, `conflictDetected:false`. |
| Security smoke | No | No secrets or permissions changed; privacy posture is covered by reduced JSON tests. | Not Run | Not required. |
| Integration smoke | No | No MCP/provider/dashboard integration changed. | Not Run | Not required. |
