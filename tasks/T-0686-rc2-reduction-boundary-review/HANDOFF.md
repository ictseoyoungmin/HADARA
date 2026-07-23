# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0686 |
| Title | RC2 Reduction Boundary Review |
| Status | Done |
| Created | 2026-07-23T18:35 |
| Updated | 2026-07-23T19:05 |
## Last Completed

| Item | Evidence |
|---|---|
| Restored the workspace to `5b62e35` (`T-0685 Stable Readiness Review`) and created a staged RC2 reduction decision record. | TASK.md History and Priorities |
| Confirmed the original Capsule already uses one complete TASK.md, one HANDOFF.md, and generated evidence. | `src/task/task-capsule.ts` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| This review is complete. Select a separate S1 characterization Capsule only after the P0 matrix is reviewed. | terminal | no | No runtime reduction should resume until each retained guarantee has an explicit focused test. | TASK.md, `src/evidence/evidence.ts`, `src/task/task-close.ts`, `src/task/task-capsule.ts`, docs/ARCHITECTURE.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The restored `HEAD` is broad and includes mature but optional surfaces. | Bulk removal would conflate product guarantees with developer or optional features. | Follow S1-S6 in TASK.md; remove one dependency-mapped batch at a time. |
| `TASK.md` and HANDOFF.md are intentionally the only human-authored task contract documents. | Restoring fragment files would recreate the small-task navigation problem. | Keep plan, risks, validation, and acceptance as sections in TASK.md. |
| Existing profile, adoption, registry, projection, and close code share files and tests. | Deleting a command root is insufficient evidence that its invariants are not used elsewhere. | Characterize imports and fresh-project behavior before removal. |
