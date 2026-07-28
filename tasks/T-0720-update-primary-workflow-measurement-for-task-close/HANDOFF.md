# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0720 |
| Title | Update Primary Workflow Measurement For Task Close |
| Status | Done |
| Created | 2026-07-28T15:59 |
| Updated | 2026-07-28T16:01 |

## Last Completed

| Item | Evidence |
|---|---|
| Replaced stale public `task finalize` measurement steps with `task close --dry-run` and reviewed `task close --execute --plan-hash`, and added regressions that forbid reintroducing `task.finalize` into the active harness. | `ev:T-0720:6e6049bf7adc4690b1571d2a` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Decide whether to harden the measurement script against the known child-process EPERM environment limit or keep that as an external environment caveat. | waiting-for-operator | no | The stale finalize regression is fixed, but direct `measure:primary-workflow` execution still cannot complete in this tool environment because nested CLI spawn hits the known EPERM failure before init. | `tasks/T-0720-update-primary-workflow-measurement-for-task-close/TASK.md`, `scripts/primary-workflow-measurement.mjs`, `docs/PROJECT_STATE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The archived Init v1 authority follow-up from T-0712 still is not represented as a machine-routed independent continuation. | Close/measurement hardening tasks can keep crowding out the separate Init continuity residual in routed continuation state. | Keep the Init authority issue visible in shared handoff/current-state routing until the continuation model can retain more than one independent residual. |
