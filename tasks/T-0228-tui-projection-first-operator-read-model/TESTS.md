# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/tui-read-model.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-cache.test.ts tests/unit/tui-terminal.test.ts | Focused TUI read-model, snapshot, cache, and terminal regression coverage. | Yes | Passed | Docker `/tmp/hadara`: 4 files / 46 tests passed. |
| npm run dev:docker-sync-build | Full Docker check/build/dist refresh/built CLI smoke. | Yes | Passed | Docker sync-build: 91 files / 595 tests passed; built CLI version smoke `ok:true`, `distLooksStale:false`. |
| node dist/cli/main.js tui --snapshot --compact --width 100 --height 26 --project /mnt/f/NowWorking/HADARA-dev | Built CLI TUI snapshot smoke after dist refresh. | Yes | Passed | Exited 0; output displayed `source projection refresh idle pending timeline,debt`. Mounted workspace snapshot took roughly 33 seconds. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, provider, shell, MCP, or public artifact boundary changes are intended. | Not Run | Not applicable unless scope changes |
| Integration smoke | Yes | TUI CLI output should expose projection status after shared read-model alignment. | Passed | Built TUI snapshot smoke displayed source/refresh/pending state. |
