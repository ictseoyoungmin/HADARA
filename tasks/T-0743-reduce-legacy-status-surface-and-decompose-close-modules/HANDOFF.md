# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0743 |
| Title | Reduce legacy status surface and decompose close modules |
| Status | Done |
| Created | 2026-08-01T19:10 |
| Updated | 2026-08-01T20:00 |

## Last Completed

| Item | Evidence |
|---|---|
| Capsule created with runtime-only scope. | none |
| Primary status routing and close module boundaries implemented. | `ev:T-0743:be2f858bebdc4c6fafae1eb7`; formal validation and smoke evidence recorded in TASK.md. |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Review `task close --dry-run` for T-0743, then execute the reviewed plan hash. | waiting-for-operator | no | Implementation and acceptance validation are complete; proof-last close is the only remaining lifecycle step and requires explicit plan review. | `docs/TASK_WORKFLOW_COMMANDS.md`; `docs/CLI_JSON_CONTRACT.md`; `src/task/close/filesystem-adapter.ts`; `src/task/close/operation-marker.ts`; `src/task/close/write-set.ts`; `src/task/close/report.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Close extraction can accidentally move lifecycle decisions into filesystem/report helpers. | Proof-last and zero-write guarantees could regress. | Preserve dependency direction; focused close regression and full check passed. |
