# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0718 |
| Title | Share Reviewed Finalize Plan In Task Close |
| Status | Done |
| Created | 2026-07-28T14:57 |
| Updated | 2026-07-28T15:01 |

## Last Completed

| Item | Evidence |
|---|---|
| Shared the reviewed finalize artifact between public `task close` and auto finalize so operation markers now use the actual requested/reviewed plan hash, and added regressions for auto/reviewed close hash consistency. | `ev:T-0718:8d0591670dfd4350b6c59a43` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Harden the remaining close transaction residuals around full journal atomicity and no-op write accounting. | actionable | yes | This task removed marker/execute hash drift, but recovery semantics still overcount `existing-noop` writes and the full proof/write/projection transaction is not yet journal-atomic. | `tasks/T-0718-share-reviewed-finalize-plan-in-task-close/TASK.md`, `src/task/task-close-transaction.ts`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The archived Init v1 authority follow-up from T-0712 is still unresolved outside this capsule. | Close-transaction work can crowd out the separate Init continuity issue again if continuation only carries one residual. | Keep the Init authority decision visible in shared handoff/current-state routing until it is handled by its own capsule. |
