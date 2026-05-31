# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run check` | Run build plus full default project test suite. | Yes | Passed | 68 files / 491 tests passed. |
| Built CLI `task status --task T-0176 --json` | Verify workbench surface remains available after design-only docs. | Yes | Passed | Returned `hadara.task.workbench.v1`. |
| Built CLI `harness validate --task T-0176 --level done --json` | Verify capsule is done-ready. | Yes | Passed | Returned `ok:true`. |
| Built CLI `task audit-close --task T-0176 --json` | Verify close evidence is coherent after close append. | Yes | Passed | Returned `ok:true` with close evidence records and zero warnings. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | Yes | This is a security-boundary design capsule. | Not Run | Covered by design/security doc review and full check. |
| Integration smoke | No | No runtime integration surface added. | Not Run | Not applicable. |
