# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/task-workflow-docs.test.ts | Run focused docs semantics regression tests. | Yes | Passed | 1 file / 3 tests passed in Docker `/tmp/hadara`. |
| npm run dev:docker-sync-build | Run Docker temp-copy check/build, refresh workspace dist, and built CLI runtime smoke. | Yes | Passed | 75 files / 521 tests passed; workspace dist refreshed; runtime version smoke returned `ok:true`. |
| node dist/cli/main.js harness validate --task T-0185 --level done --json --project /mnt/f/NowWorking/HADARA-dev | Validate T-0185 done-level capsule state. | Yes | Passed | Returned `ok:true` with no issues. |
| node dist/cli/main.js task audit-close --task T-0185 --json --project /mnt/f/NowWorking/HADARA-dev | Verify close evidence after close execute. | Yes | Passed | Returned `ok:true` with close evidence present and no warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changes. | Not Run | Not applicable. |
| Integration smoke | No | No runtime integration surface changes. | Not Run | Not applicable. |
