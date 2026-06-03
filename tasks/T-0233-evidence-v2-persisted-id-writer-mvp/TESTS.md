# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts tests/unit/evidence-normalizer.test.ts tests/unit/evidence-lint.test.ts tests/harness/harness-validate.test.ts tests/unit/task-workbench.test.ts tests/unit/task-close.test.ts tests/unit/dashboard-task-detail.test.ts tests/unit/dashboard-timeline.test.ts tests/unit/tui-read-model.test.ts` | Writer/read-model compatibility suite. | Yes | Passed: 10 files / 81 tests. | Docker focused validation. |
| `npm run test:focused -- tests/unit/task-json.test.ts tests/unit/mcp-tools.test.ts tests/unit/agent-evidence.test.ts tests/unit/tui-cache.test.ts tests/unit/release-dry-run.test.ts tests/unit/release-artifact.test.ts tests/unit/schema-fixtures.test.ts tests/unit/evidence-semantics.test.ts tests/unit/operational-debt.test.ts` | Adjacent read-model/release/schema compatibility sweep. | Yes | Passed: 9 files / 78 tests. | Docker focused validation. |
| `npm run dev:docker-sync-build` | Full reproducible Docker validation and workspace `dist` refresh. | Yes | Passed: 91 files / 599 tests; built CLI smoke `ok:true`, `distLooksStale:false`. | Docker sync-build. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host `npm run build` | No | Host dependencies are not the HADARA-dev validation baseline. | Failed: host `tsc` unavailable because host `node_modules` is missing. | Replaced by Docker sync-build. |
| Built task lifecycle smoke | Yes | This capsule must prove self-hardening under v2 evidence. | Passed: `task ready`, `task finish`, `task close`, and `task audit-close` for T-0233. | Built CLI lifecycle checks. |
