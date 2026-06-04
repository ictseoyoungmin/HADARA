# T-0238 Task Close Audit Boundary Guidance

## Metadata

| Field | Value |
|---|---|
| ID | T-0238 |
| Title | Task Close Audit Boundary Guidance |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Make task close/audit reports explain the three-layer close model in machine-readable form. | Operators should see that validation proves readiness, close records the proof, and audit checks the already-appended close record without treating close evidence as a same-run precondition. |

## Scope

| In Scope | Reason |
|---|---|
| Add close/audit boundary guidance fields to `hadara.task.close.v1` and `hadara.task.audit_close.v1`. | Additive report metadata can guide operators and downstream read models without changing existing command behavior. |
| Cover dry-run, execute, and audit behavior with focused tests. | Prevent regressions in the fixed-point close model. |
| Update task workflow docs if command semantics wording needs clarification. | Keep operator docs aligned with report behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Expanding `task close --execute` writes beyond close evidence append. | The bounded write boundary is intentional and should remain unchanged. |
| Making `task audit-close` mutate files. | Audit is a read-only post-close verification pass. |
| Reworking workbench, Dashboard, or TUI close-state UI. | This capsule hardens shared close/audit reports only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to additive close/audit boundary guidance and focused validation. | Capsule update |
| 2026-06-04 | Done | Finished task capsule. | `hadara task finish --execute` |

