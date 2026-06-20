# T-0396 Task Finalize Dry-Run Plan

## Metadata

| Field | Value |
|---|---|
| ID | T-0396 |
| Title | Task Finalize Dry-Run Plan |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only `task finalize` planning surface that shows the remaining canonical lifecycle steps, expected write paths, and a stable plan hash. | Preserve HADARA's finish/ready/close/audit proof boundaries while reducing agent workflow confusion. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara task finalize --task <id> --json` report and schema. | Provides one high-level, read-only lifecycle plan for agents. |
| Execute refusal for `task finalize --execute`. | Keeps the first slice non-mutating and forces explicit review before any future guarded execute mode. |
| CLI, command registry, schema registry, docs, and tests. | Makes the surface discoverable and contract-backed. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic finish/ready/close/audit execution. | Guarded execute is reserved for a later capsule after the dry-run contract is proven. |
| Changing canonical lifecycle command semantics. | Existing finish/ready/close/audit commands remain the only lifecycle writers. |
| Broad historical lifecycle migration. | This capsule only adds an additive convenience read model. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Task scaffold created for the finalize dry-run plan capsule. | `tasks/T-0396-task-finalize-dry-run-plan/` |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
