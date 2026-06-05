# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed | Covered inside Docker sync-build: 95 files / 644 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed | `npm run dev:docker-sync-build` ran build + tests and refreshed `dist`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built handoff suggest smoke | Yes | Confirms refreshed `dist` exposes the new command. | Passed | `node dist/cli/main.js handoff suggest --task T-0257 --json` returned `ok:true`, `readOnly:true`. |
| Built execute rejection smoke | Yes | Confirms the suggestion command remains read-only. | Passed | `node dist/cli/main.js handoff suggest --task T-0257 --execute --json` exited 6 with `HANDOFF_SUGGEST_EXECUTE_UNSUPPORTED`. |
| Security smoke | No | No secrets, permissions, storage, or execution boundaries changed beyond read-only metadata. | Not Run | Not required. |
| Integration smoke | No | No MCP/provider/dashboard integration changed. | Not Run | Not required. |
