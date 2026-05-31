# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused `npx vitest run tests/unit/task-workbench.test.ts tests/unit/task-close.test.ts` | Validate task status and audit-close text sections. | Yes | Passed | 2 files / 8 tests passed. |
| Docker `npm run check` | Run build plus full default project test suite. | Yes | Passed | 68 files / 491 tests passed. |
| Built CLI `task status --task T-0174` | Verify non-JSON status output is grouped. | Yes | Passed | Printed State/Evidence/Protocol/Close/Suggested next sections. |
| Built CLI `harness validate --task T-0174 --level done --json` | Verify capsule is done-ready. | Yes | Passed | Returned `ok:true`. |
| Built CLI `task audit-close --task T-0174` | Verify non-JSON audit output is grouped after close. | Yes | Passed | Printed State/Close Evidence/Audit/Suggested next sections and JSON audit returned `ok:true`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Formatting-only, no new write/execution surface. | Not Run | Not applicable. |
| Integration smoke | No | No external integration surface changes. | Not Run | Not applicable. |
