# T-0400 Default Lifecycle Finalize Documentation

## Metadata

| Field | Value |
|---|---|
| ID | T-0400 |
| Title | Default Lifecycle Finalize Documentation |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Make 0.3.3 finalize-first lifecycle the default agent-facing path. | Align root docs, generated init docs, registry-backed help, and lifecycle projections so agents see `task lifecycle` + reviewed `task finalize` as the ordinary close path. |

## Scope

| In Scope | Reason |
|---|---|
| Root agent/user documentation lifecycle guidance. | Agents should follow the 0.3.3 finalize-first path by default. |
| Generated init profile documentation. | New projects must scaffold the same lifecycle guidance. |
| Registry-backed lifecycle help/projection. | `hadara help lifecycle` and JSON guide output should stop presenting the old low-level sequence as the primary path. |
| Focused and full validation. | The lifecycle contract is partly enforced by tests and built CLI smoke. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Removing low-level proof-boundary commands. | `task finish`, `task ready`, `task close`, and `task audit-close` remain available for debugging, recovery, and command implementation work. |
| Changing underlying finalize execution semantics. | This capsule changes default guidance/projection, not the guarded execution algorithm. |
| Publishing a release. | Release work is outside this documentation/default-path capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Done | Finalize-first lifecycle is now the default agent-facing path in docs, help, registry projection, and init templates. | ev:T-0400:d792e4cabcdb49398eed875b |
<!-- hadara:managed:end task-status-history -->
