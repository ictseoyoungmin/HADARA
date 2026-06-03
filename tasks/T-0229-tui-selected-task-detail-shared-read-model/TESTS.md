# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/tui-read-model.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-cache.test.ts tests/unit/tui-terminal.test.ts | Focused TUI selected detail/cache/snapshot/terminal regression coverage. | Yes | Passed | Docker `/tmp/hadara`: 4 files / 46 tests passed. |
| npm run dev:docker-sync-build | Full Docker check/build/dist refresh/built CLI smoke. | Yes | Passed | Docker sync-build: 91 files / 595 tests passed; built CLI version smoke `ok:true`, `distLooksStale:false`. |
| node dist/cli/main.js tui --snapshot --compact --width 100 --height 26 --project /mnt/f/NowWorking/HADARA-dev | Built TUI snapshot smoke after dist refresh. | Yes | Passed but slow | Exited 0; output displayed selected task shared proof text and projection status; elapsed 42.56s on `/mnt/f`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, provider, shell, MCP, or public artifact boundary changes are intended. | Not Run | Not applicable unless scope changes |
| Integration smoke | Yes | TUI CLI output should still render selected task state after shared detail aggregate alignment. | Passed | Built snapshot output displayed `Proof unknown: No semantic proof summary is available.` from shared dashboard task-detail proof. |
