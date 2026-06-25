# T-0412 Finalize Post-Close Drift Guidance

## Metadata

| Field | Value |
|---|---|
| ID | T-0412 |
| Title | Finalize Post-Close Drift Guidance |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Make post-close drift guidance explicit. | `task finalize` and `task lifecycle` should route stale close proof to repair guidance instead of treating warning-only drift as closed-valid. |

## Scope

| In Scope | Reason |
|---|---|
| Finalize audit step classification for close-source drift. | Prevents stale close proof from appearing complete in finalize. |
| Lifecycle phase/check classification for close-source drift. | Keeps session/lifecycle guidance aligned with finalize. |
| Focused tests and docs/state updates. | Proves the behavior and records current project state. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Weakening close/audit proof semantics. | Close-source drift remains a repair-required state. |
| Broad close repair redesign. | Existing `task close-repair-plan` remains the repair detail surface. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25T05:14:00.000Z | Draft | Initial task scaffold. | Task create. |
| 2026-06-25T05:20:00.000Z | Done | Implemented and validated finalize/lifecycle close-source drift guidance. | `ev:T-0412:32fdb139512446aaa3806924` |
<!-- hadara:managed:end task-status-history -->
