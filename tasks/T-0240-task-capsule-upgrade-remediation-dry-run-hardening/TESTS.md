# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/task-upgrade-scaffold.test.ts tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts tests/unit/workbench-next-actions.test.ts tests/unit/schema-fixtures.test.ts | Validate before-hash guards, schemas, CLI dry-run contract, and workbench remediation guidance. | Yes | Passed: 5 files / 36 tests. | `ev:T-0240:c306331f9c5941c9ace228a3`. |
| npm run dev:docker-sync-build | Run full Docker check, refresh `/workspace/dist`, and smoke built CLI version. | Yes | Passed: 92 files / 610 tests; built version smoke ok:true. | `ev:T-0240:03984c91a4e04e179c81a92e`. |
| Built CLI guard smoke | Verify `task upgrade-scaffold` and `protocol remediate` dry-runs emit hashes, no-hash execute fails, and matching-hash execute writes in a temp project. | Yes | Passed. | `ev:T-0240:d57676974e444f5e855f9130`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No secrets, permissions, provider, MCP, or artifact boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No dashboard/TUI/MCP/provider runtime integration changed. | Not Run | Not applicable. |
