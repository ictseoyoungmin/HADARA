# T-0397 Task Finalize Execute Guard

## Metadata

| Field | Value |
|---|---|
| ID | T-0397 |
| Title | Task Finalize Execute Guard |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Add guarded `task finalize --execute --plan-hash <hash>` orchestration. | Let agents optionally execute a reviewed lifecycle plan while preserving finish/ready/close/audit proof boundaries. |

## Scope

| In Scope | Reason |
|---|---|
| Plan-hash guarded execute mode for `hadara task finalize`. | Prevent stale or unreviewed lifecycle writes. |
| Serial finish, ready, close, and audit orchestration. | Preserve canonical command order and stop on blockers. |
| Execution metadata, schema/docs/registry updates, and tests. | Make writes auditable and machine-readable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replacing canonical lifecycle commands. | `task finalize` remains a convenience wrapper around the existing proof model. |
| Hidden shared-doc updates. | Shared close-source docs must be finalized before execute. |
| Parallel execution or retries. | Serial execution with stop-on-blocker is the safer first implementation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Task scaffold created for the finalize execute guard capsule. | `tasks/T-0397-task-finalize-execute-guard/` |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
