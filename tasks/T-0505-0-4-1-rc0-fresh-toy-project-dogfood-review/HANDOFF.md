# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Fresh `/tmp` governed toy project dogfood completed; toy calculator task reached `closed-valid`; structured findings recorded. | `ev:T-0505:5f6574df14104b37b948b3fa` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether F-1/F-3/F-4/F-5 should block `0.4.1-rc.0` release smoke or become a focused follow-up capsule. | Core lifecycle worked, but handoff suggest/help/update-task wrapper friction remains. | `DOGFOOD_REPORT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `handoff suggest` templates are stale. | Can route agents back to `task next` and mark Draft tasks as Latest Completed. | Treat as a focused UX fix candidate before release smoke if handoff output is part of acceptance. |
| `docs mark --help` still validates arguments before help. | One remaining help-routing inconsistency. | Add early registry help routing for docs mark. |
| `validation run` npm spawn EPERM reproduced in `/tmp` toy project. | Wrapper evidence can be blocked even when direct npm command passes. | Use direct-result evidence for this environment; investigate wrapper spawn separately. |
