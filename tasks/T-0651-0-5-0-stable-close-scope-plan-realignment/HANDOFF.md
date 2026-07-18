# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0651 |
| Title | 0.5.0 stable close scope plan realignment |
| Status | Done |
| Created | 2026-07-18T19:50 |
| Updated | 2026-07-18T19:56 |
## Last Completed

| Item | Evidence |
|---|---|
| 0.5.0 stable scope now includes task-close transaction, public `task close` migration, and installed/delegated close dogfood. | ev:T-0651:a58e66ed3614418ea48f32e7 |
| Former 0.5.1 and 0.5.2 documents were retained as folded design modules rather than deleted. | ev:T-0651:a58e66ed3614418ea48f32e7 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start the 0.5.0 stable close transaction capsule (`050-C07`) next. | Stable promotion is now blocked on close implementation and dogfood, not only status ingress. | `docs/specs/0.5/README.md`, `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md`, `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Existing `0.5.1`/`0.5.2` folder names remain for source design continuity. | Readers may mistake them for future release promises. | Use the status-update banners and 0.5 README decision block as the source of truth until folders are resplit or renamed. |
