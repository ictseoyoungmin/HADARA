# T-0300 Protocol migrate task evidence preservation blocker fix

## Metadata

| Field | Value |
|---|---|
| ID | T-0300 |
| Title | Protocol migrate task evidence preservation blocker fix |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Prevent release-blocking protocol/task workflow data corruption. | `hadara protocol migrate --target 0.3.0 --task <id>` must never overwrite an existing evidence index, and `task finish` must keep Done Status History rows inside the managed Markdown table. |

## Scope

| In Scope | Reason |
|---|---|
| `src/services/protocol-migration.ts` task evidence planning | Replace empty-content sync behavior with create-if-missing behavior. |
| `tests/unit/protocol-migration.test.ts` regression coverage | Prove existing `evidence.jsonl` content is preserved after dry-run and execute. |
| `src/task/task-finish.ts` Status History insertion | Keep the Done row inside the managed `task-status-history` table instead of appending after the end marker. |
| `tests/unit/task-finish.test.ts` regression coverage | Prove finish-generated Done rows precede the managed end marker. |
| T-0299 handoff drift correction | Align the closed T-0299 task-local handoff with its actual closed-valid state. |
| T-0299/T-0300 `TASK.md` table repair | Move malformed Done rows back inside the managed Status History table. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `hadara@0.3.0-rc.1` publish/final readiness | Publish remains deferred to a later release capsule. |
| Batch-transactional migration writes | Per-file guarded writes remain as designed; broader transactional hardening is future scope. |
| Release notes entry for rc.1 | Required in the later final readiness/publish capsule, not this blocker fix. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-11 | In Progress | Fixing task-scoped migration evidence preservation blocker. | Reviewer feedback identified existing `evidence.jsonl` overwrite risk. |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
