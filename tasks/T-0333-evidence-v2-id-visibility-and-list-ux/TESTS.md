# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/command-registry.test.ts tests/unit/init.test.ts | Focused T-0333 runtime/docs coverage. | Yes | Passed in Docker: 5 files / 64 tests. Host run blocked because `vitest` was absent. | ev:T-0333:4c966c0ed61d4eeb890163b0; ev:T-0333:1c6c383aa5144b6f8624005a; ev:T-0333:549f296e23c24210842292e8 |
| npm run test:focused -- tests/unit/task-json.test.ts tests/unit/mcp-tools.test.ts tests/unit/tui-snapshot.test.ts tests/unit/release-dry-run.test.ts | Targeted rerun for full-suite failures and timeout-only cases. | Yes | Passed in Docker: 4 files / 46 tests. | ev:T-0333:549f296e23c24210842292e8 |
| npm run dev:docker-sync-build | Full Docker validation and workspace dist refresh. | Yes | Passed: 119 files / 791 tests; version smoke `distLooksStale:false`. | ev:T-0333:e0d7e225facb4be6b4caa15c |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI `evidence list` text/JSON smoke | Yes | Confirms operator-facing output after dist refresh. | Passed for T-0330 text and JSON; `git diff --check` passed. | ev:T-0333:8cf3ef630872417b90acd82d |
| Evidence lint | Yes | Verify JSONL integrity after evidence append correction. | Passed: 5 records, 0 issues. | ev:T-0333:549f296e23c24210842292e8 |
