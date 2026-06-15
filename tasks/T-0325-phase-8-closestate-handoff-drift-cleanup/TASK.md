# T-0325 Phase 8 CloseState handoff drift cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0325 |
| Title | Phase 8 CloseState handoff drift cleanup |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Remove persistent CloseState from task-local close-source handoffs and make close proof state derived by read models. | Addresses the fixed-point drift where close evidence is appended after HANDOFF.md is hashed as close source. |

## Scope

| In Scope | Reason |
|---|---|
| Update new Task Capsule HANDOFF scaffolds to persist `TaskStatus` only. | Prevents new capsules from storing stale close proof state. |
| Make done-level validation reject persisted `CloseState` rows in task-local HANDOFF current-state tables. | Turns the fixed-point failure mode into an actionable blocker before close. |
| Update state projection guidance and warnings for persisted `CloseState`. | Keeps read-model diagnostics aligned with the new source-of-truth boundary. |
| Remove stale `CloseState` rows from recent Phase 8 task-local handoffs. | Repairs visible drift in current rc1 capsules. |
| Harden `findTaskCapsule()` when same-id local leftovers lack `TASK.md`. | Completes the T-0324 discovery hardening edge case. |
| Update current docs, generated init docs, and Phase 8 specs to document derived close state. | Prevents future workers from repeating the old pattern. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Make `task close --execute` update HANDOFF.md. | Close command must remain close-evidence-only to avoid mutating close-source docs during close. |
| Mass-migrate historical handoffs outside the recent Phase 8 drift set. | This task fixes current visible drift and generated behavior; broad history cleanup should be separate and dry-run-first. |
| Change close evidence schema or audit-close proof semantics. | The issue is source placement of close state, not proof calculation itself. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-15 | In Progress | Implementing reviewer-requested CloseState derived-state cleanup and discovery hardening. | T-0325 capsule |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
