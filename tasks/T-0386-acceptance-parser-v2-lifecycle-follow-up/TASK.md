# T-0386 Acceptance Parser v2 Lifecycle Follow-up

## Metadata

| Field | Value |
|---|---|
| ID | T-0386 |
| Title | Acceptance Parser v2 Lifecycle Follow-up |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Implement the first acceptance parser v2 lifecycle hardening slice. | Add a shared acceptance readiness parser for legacy and v2 acceptance tables, use it from done-level harness/protocol checks, and keep existing ready/close issue compatibility. |

## Scope

| In Scope | Reason |
|---|---|
| Shared acceptance row parser and readiness analysis. | Prevent harness/protocol from growing separate ad-hoc status lists. |
| Done-level harness acceptance validation. | It blocks close through `task ready` and `task close`. |
| Protocol consistency done acceptance check. | It reports Done capsule drift outside direct harness validation. |
| Focused and full validation. | Runtime validation is required because source behavior changed. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full `hadara.taskReady.v2` JSON contract. | This slice hardens the existing v1 readiness path without replacing public report schemas. |
| Scope-boundary/risks/follow-up read model across all task docs. | The parser extracts row-local refs only; broader debt graphing can be a future lifecycle slice. |
| Changing default Task Capsule templates to v2 acceptance tables. | Existing legacy tables must keep working first. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | Task creation |
| 2026-06-19 | In Progress | Implementing shared acceptance parser v2 lifecycle hardening. | `ev:T-0386:4413cd420e354248bb671461` |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
