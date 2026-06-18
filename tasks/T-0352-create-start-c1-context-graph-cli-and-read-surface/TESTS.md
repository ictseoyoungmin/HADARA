# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-graph-cli.test.ts tests/unit/context-graph-builder.test.ts tests/unit/command-registry.test.ts tests/unit/context-graph-schema.test.ts` | Run focused CLI/builder/registry/schema coverage. | Yes | Passed: 4 files / 15 tests in Docker `/tmp/hadara`. | ev:T-0352:d70ee6360acf43948d7cf620 |
| `npm run build` | Run TypeScript build. | Yes | Passed in Docker `/tmp/hadara`. | ev:T-0352:d70ee6360acf43948d7cf620 |
| `npm run check` | Run the full repository check when available. | Yes | Passed: 129 files / 823 tests in Docker `/tmp/hadara`. | ev:T-0352:d70ee6360acf43948d7cf620 |
| Built CLI `context graph` smoke | Confirm workspace built CLI emits task graph JSON. | Yes | Passed: `ok:true`, `schemaVersion:"hadara.contextGraph.v1"`, `mode:"task"`, `cache.used:false`. | ev:T-0352:d70ee6360acf43948d7cf620 |
| Built CLI version smoke | Confirm refreshed `/workspace/dist` is not stale. | Yes | Passed: `distLooksStale:false`. | ev:T-0352:d70ee6360acf43948d7cf620 |
| `git diff --check` | Check whitespace errors. | Yes | Passed. | ev:T-0352:d70ee6360acf43948d7cf620 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Command is read-only and does not change permissions, secrets, storage, or execution boundaries. | Not Run | Not required. |
| Integration smoke | No | MCP/existing read-surface integration remains later scope. | Not Run | Deferred. |
