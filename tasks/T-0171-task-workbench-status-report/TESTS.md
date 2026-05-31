# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npx vitest run tests/unit/task-workbench.test.ts` | Validate task workbench service/CLI/no-write behavior. | Yes | Passed | 1 file / 3 tests passed. |
| Docker `npm run check` | Run build plus full default project test suite. | Yes | Passed | 67 files / 486 tests passed. |
| Built CLI `task status --task T-0171 --json` | Verify workspace built CLI exposes the new command after refresh. | Yes | Passed | Returned `hadara.task.workbench.v1`. |
| Built CLI `harness validate --task T-0171 --level done --json` | Verify capsule is done-ready. | Yes | Passed | Returned `ok:true`. |
| Built CLI `task audit-close --task T-0171 --json` | Verify close evidence is coherent after close append. | Yes | Passed | Final audit returned `ok:true`, two close records, zero warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| No-write smoke | Yes | `task status` is a read-only operator console. | Passed | Unit snapshot test covers docs and task evidence files. |
| Integration smoke | No | No MCP/dashboard/TUI integration surface is added in T-0171. | Not Run | Not applicable. |
