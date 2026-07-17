# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara task status --json` without `--task` now emits `hadara.taskSelection.status.v2`. | ev:T-0635:6d3053b41c2b4a8c9381e7f2 |
| `hadara task status --compat v1 --json` preserves the old select-work report with migration metadata. | ev:T-0635:55d39aba2aff4f21ae823902 |
| Focused task-workbench/schema/help tests and TypeScript build passed. | ev:T-0635:c9301105ecae4850b9792586; ev:T-0635:3bc40f7466f14b14a3cb5c30 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement 050-C04 selected-task status v2 cockpit. | No-selected-task routing is now v2; selected-task reports still use `hadara.task.workbench.v1`. | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md`; `docs/specs/0.5/all/HADARA_0_5_X_Combined_Lifecycle_Usecases.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Selected-task `task status --task T --json` is still v1. | 050-C04 remains incomplete; agent loop has mixed v2/v1 until selected-task cockpit lands. | Keep v1 stable and add selected-task v2 in the next capsule. |
| Public `session start` remains routed. | 050-C05 should wait until selected-task v2 is available. | Remove public session ingress after C04. |
