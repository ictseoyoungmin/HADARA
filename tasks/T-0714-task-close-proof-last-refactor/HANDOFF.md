# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0714 |
| Title | Task Close Proof-Last Refactor |
| Status | Done |
| Created | 2026-07-28T13:02 |
| Updated | 2026-07-28T13:10 |

## Last Completed

| Item | Evidence |
|---|---|
| Reordered guarded `task close` so virtual post-finish readiness and close proof run before real TASK.md / Task Board `Done` bookkeeping; updated focused lifecycle tests and workflow/init contract text to match. | `ev:T-0714:ff578bcf6ac446a0b06b0b9f` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Decide whether to stop at proof-last semantics or continue to a journaled close transaction that makes proof append and lifecycle-owned `Done` writes recover as one reviewed unit. | waiting-for-operator | no | The current refactor fixes the user-reported ordering problem but still leaves a narrower recovery case when finish bookkeeping fails after proof append. | `tasks/T-0714-task-close-proof-last-refactor/TASK.md`; `src/task/task-finalize.ts`; `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Partial recovery semantics changed shape: a failed rerun after proof append can now leave close proof recorded before final audit completes. | operator/reviewer tooling and future atomicity work must treat proof-before-finish recovery as the expected residual state. | Use the persisted task-close recovery marker and rerun `hadara task close --task T-0714 --json` after repairing blockers; do not assume `closeProofAppended=false` is the only partial-close signature anymore. |
