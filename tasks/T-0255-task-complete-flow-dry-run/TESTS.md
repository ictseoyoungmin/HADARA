# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Standard Docker build, full test suite, dist refresh, and built CLI version smoke. | Yes | Passed: 94 files / 638 tests; built CLI `version --verbose --json` returned `ok:true`, `distLooksStale:false`. | Evidence record. |
| `node dist/cli/main.js task complete --task T-0255 --json` | Built CLI smoke for the new read-only command. | Yes | Passed schema shape; exited 6 as expected while the active capsule was not yet finished, with stage `finish-required` and primary next action `execute-finish`. | Evidence record. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Direct focused test command in bind-mounted `/workspace` | No | Attempted before Docker sync-build to get a narrow signal. | Blocked by missing `node_modules`/Vitest in the mounted container workspace. | Not used as validation baseline. |
| `docker exec hadara-dev ... npm ci` in mounted `/workspace` | No | Attempted to repair the focused-test environment. | Blocked by Windows bind-mount symlink `EPERM` for esbuild. | Standard temp-copy Docker workflow used instead. |
