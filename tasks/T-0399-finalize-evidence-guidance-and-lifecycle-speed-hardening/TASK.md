# T-0399 Finalize Evidence Guidance and Lifecycle Speed Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0399 |
| Title | Finalize Evidence Guidance and Lifecycle Speed Hardening |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Improve `task finalize` ergonomics and speed without weakening proof boundaries. | Make weak-evidence blockers point to the correct evidence command and avoid computing later lifecycle reports when earlier steps already block. |

## Scope

| In Scope | Reason |
|---|---|
| `task finalize` evidence-quality guidance. | Agents were rerunning readiness instead of recording substantive passed validation evidence. |
| `task finalize` lazy lifecycle report evaluation. | Draft or blocked tasks should not pay for ready/close/audit read-model composition until finish is satisfied. |
| Additive schema/test/docs updates. | Expose evaluated/skipped report diagnostics and preserve compatibility. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replacing `task finish`, `task ready`, `task close`, or `task audit-close`. | The canonical proof boundaries remain unchanged. |
| Hidden writes from read-only finalize dry-run. | `task finalize` dry-run must remain read-only. |
| Broad mounted-filesystem context-routing optimization. | This capsule only removes an avoidable lifecycle read-model bottleneck. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
