# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0321 |
| TaskStatus | Done |
| CloseState | not-closed |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0320 separated TaskStatus/CloseState and closed valid. | `4eb5c82`; T-0320 audit-close `closed-valid` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open Phase 8.4 state consistency projection read-model work. | Phase 8.3 reclassified exact `npx` as convenience/environment evidence and removed fresh governed historical Required Reading warnings. | `docs/specs/0.3.1/rc1/04_State_Consistency_Projection_Read_Model.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Current repo docs doctor still has pre-existing unregistered Required Reading warnings and a `REFACTOR_LOG.md` archive candidate. | These are warning-only and separate from the fresh governed historical Required Reading warning fixed here. | Phase 8.4 state projection can report them without making them release blockers. |
