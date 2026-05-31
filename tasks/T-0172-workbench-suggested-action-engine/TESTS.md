# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npx vitest run tests/unit/workbench-next-actions.test.ts tests/unit/task-workbench.test.ts` | Validate action engine mappings and workbench integration. | Yes | Passed | 2 files / 8 tests passed. |
| Docker `npm run check` | Run build plus full default project test suite. | Yes | Passed | 68 files / 491 tests passed. |
| Built CLI `task status --task T-0172 --json` | Verify workbench exposes centralized actions. | Yes | Passed | Returned `hadara.task.workbench.v1` with `priority` and `sourceIssueCodes` in nextActions. |
| Built CLI `harness validate --task T-0172 --level done --json` | Verify capsule is done-ready. | Yes | Passed | Returned `ok:true`. |
| Built CLI `task audit-close --task T-0172 --json` | Verify close evidence is coherent after close append. | Yes | Passed | Returned `ok:true` with close evidence records and zero warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No new execution, write, provider, or MCP surface. | Not Run | Not applicable. |
| Integration smoke | No | No external integration surface changes. | Not Run | Not applicable. |
