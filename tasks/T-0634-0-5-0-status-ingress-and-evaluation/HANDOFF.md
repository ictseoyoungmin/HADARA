# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara status --json` now emits `hadara.project.status.v2` by default. | ev:T-0634:42fcbebc9c014652947f3e61 |
| `hadara status --compat v1 --json` preserves `hadara.ops.status.v1` with migration metadata. | ev:T-0634:573b66d48db540f9bb8f7784 |
| Focused status/schema/smoke/help tests and TypeScript build passed. | ev:T-0634:d2b3eaf8c787400abbd4219a; ev:T-0634:6ae4618500d54ef0afca34be |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement 050-C03 task-selection status v2 and 050-C04 selected-task cockpit in follow-up capsules. | T-0634 intentionally stops at project/session ingress and explicit v1 compatibility. | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md`; `docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Public `session start` is still routed and documented after this capsule. | 050-C05 remains incomplete; new users may still see two ingress concepts. | Remove public `session start` only after task-selection and selected-task status v2 are available. |
| `status --summary-json` and `status --state-only` remain legacy explicit projections. | Existing automation still works, but these are not the new default ingress. | Keep them documented as compatibility/diagnostic modes during 0.5.x. |
