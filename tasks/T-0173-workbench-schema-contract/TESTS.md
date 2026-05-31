# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npx vitest run tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/workbench-next-actions.test.ts` | Validate workbench schema, schema index, and action object shape. | Yes | Passed | 3 files / 9 tests passed. |
| Docker `npm run check` | Run build plus full default project test suite. | Yes | Passed | 68 files / 491 tests passed. |
| Built CLI `task status --task T-0173 --json` | Verify built CLI emits schemaVersion `hadara.task.workbench.v1`. | Yes | Passed | Returned `hadara.task.workbench.v1`. |
| Built CLI `harness validate --task T-0173 --level done --json` | Verify capsule is done-ready. | Yes | Passed | Returned `ok:true`. |
| Built CLI `task audit-close --task T-0173 --json` | Verify close evidence is coherent after close append. | Yes | Passed | Returned `ok:true` with close evidence records and zero warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Schema fixture only; no new write/execution surface. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/dashboard/TUI integration added in T-0173. | Not Run | Not applicable. |
