# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-slice.test.ts tests/unit/context-graph-cli.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts` | Host focused check for C4 files. | No | Blocked: host `vitest` unavailable; superseded by Docker validation. | `ev:T-0369:804344ee78404022a3f3c050`, resolved by `ev:T-0369:6a145235ce7948b3b3d3178a` |
| `npm run dev:docker-check` | Docker temp-copy full `npm run check`. | Yes | Passed: 134 test files, 871 tests. | `ev:T-0369:905e29de909447c792f65df0` |
| `npm run dev:docker-sync-build` | Build in Docker, refresh `/workspace/dist`, and run built CLI version smoke. | Yes | Passed: dist refreshed and `distLooksStale=false`. | `ev:T-0369:0d173cea1f054b8680afe2b5` |
| `node dist/cli/main.js context slice --path docs/TASK_BOARD.md --keyword T-0369 --window 2 --json` | Built CLI C4 context slice smoke. | Yes | Passed: `hadara.contextSlice.v1`, one bounded slice, no issues. | `ev:T-0369:fc46ecd5d91943e986e1af23` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Boundary covered by unit tests for outside paths and binary files. | Covered by Docker check. | `ev:T-0369:905e29de909447c792f65df0` |
| Integration smoke | Yes | New built CLI command surface. | Passed built CLI smoke. | `ev:T-0369:fc46ecd5d91943e986e1af23` |
