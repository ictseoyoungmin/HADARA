# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0716 |
| Title | Close Replay and Validation Trust Hardening |
| Status | Done |
| Created | 2026-07-28T14:28 |
| Updated | 2026-07-28T14:40 |

## Last Completed

| Item | Evidence |
|---|---|
| Re-closed stale capsules `T-0711` and `T-0713`, then hardened finalize/close replay semantics and broader validation trust. | `ev:T-0716:5d0792aa27dd4c348032e2a6` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Continue trust hardening for explicit reviewed finalize replay and the remaining journal transaction residual called out in `RF-1`. | actionable | yes | Public `task close` is safe again, but explicit reviewed finalize still prefers safe refusal over replaying a persisted reviewed write-set across long review gaps. | `docs/TASK_WORKFLOW_COMMANDS.md`, `tasks/T-0716-close-replay-and-validation-trust-hardening/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Explicit reviewed `task finalize --execute --plan-hash` still refuses stale reviewed plans instead of replaying a persisted reviewed finish write-set. | Long review gaps around manual finalize review/execution can still require a fresh dry-run. | Keep using public `hadara task close --task T-XXXX --json` for ordinary worker flow; treat explicit finalize reviewed-plan replay as remaining hardening work. |
