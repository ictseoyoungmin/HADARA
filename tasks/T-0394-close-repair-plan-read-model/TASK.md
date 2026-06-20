# T-0394 Close Repair Plan Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0394 |
| Title | Close Repair Plan Read Model |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only close repair plan command for task lifecycle proof states. | The command classifies close proof repair state and returns exact next actions without appending evidence or mutating task docs. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara task close-repair-plan --task T-XXXX --json` | Provides the dedicated close-proof repair API specified in the lifecycle convenience line. |
| `hadara.task.closeRepairPlan.v1` schema and registry wiring | Keeps CLI, docs, registry, and schema fixtures consumable by agents. |
| Unit tests for not-closed, stale, invalid, duplicate, valid, and CLI report cases | Proves the command handles the close repair states agents otherwise infer manually. |
| Command/docs updates for workflow guidance | Makes the new read-only surface discoverable without weakening the canonical finish/ready/close/audit boundary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `task finalize` dry-run or execute orchestration | Reserved for later lifecycle convenience capsules after the read-only repair model is stable. |
| Automatic shared-doc repair or close evidence mutation | The repair plan is read-only and must not hide proof-boundary writes. |
| Broad historical close-proof cleanup | This capsule adds the diagnostic surface and tests, not a migration of old capsules. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
