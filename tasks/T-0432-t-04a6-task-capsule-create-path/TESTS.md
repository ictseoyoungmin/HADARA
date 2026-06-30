# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run build` in Docker temp checkout | Compile TypeScript after applying current diff. | Yes | Passed | `ev:T-0432:6e7934c04498493ba76eac8f` |
| `npm run test:focused -- tests/unit/task-capsule.test.ts tests/unit/task-create.test.ts tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/task-lifecycle.test.ts tests/unit/mcp-tools.test.ts tests/contract/mcp-bridge-contract.test.ts tests/contract/cli-mcp-service-parity.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts tests/unit/init.test.ts` in Docker temp checkout | Validate 0.4 create path plus lifecycle/read-model compatibility. | Yes | Passed, 12 files / 77 tests | `ev:T-0432:6e7934c04498493ba76eac8f` |
| Built CLI `task create "Smoke 0.4 Capsule"` in `/tmp/hadara-t0432-smoke` | Verify refreshed `dist` generates the accepted four-file capsule. | Yes | Passed | `ev:T-0432:6e7934c04498493ba76eac8f` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full repository check | No | Scoped capsule; legacy upgrade/state projection expectations are not the T-04A6 acceptance surface. | Not Run | See risk note |
