# T-0342 Context Routing Spec Docs Registration

## Metadata

| Field | Value |
|---|---|
| ID | T-0342 |
| Title | Context Routing Spec Docs Registration |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Register the 0.3.3 context-routing specs in project docs and fix stale spec-internal routing paths. | Keep this documentation-only slice read-only with respect to runtime behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Fix stale `docs/specs/context-routing/...` references to the actual `docs/specs/0.3.3/context-routing/...` path. | Prevent worker agents from following missing paths. |
| Add 0.3.3 context-routing spec rows to project documentation routing surfaces. | Make the new specs discoverable from `docs/IMPLEMENTATION_SOP.md` and the docs registry projection. |
| Update this Task Capsule and current handoff state. | Preserve HADARA evidence and handoff continuity. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement context-routing runtime commands or schemas. | This task only registers and routes the existing specs. |
| Change release/package behavior. | No release surface changes are required for documentation routing. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started documentation registration and path-correction slice. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
