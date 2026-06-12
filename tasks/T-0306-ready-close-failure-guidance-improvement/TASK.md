# T-0306 Ready/Close Failure Guidance Improvement

## Metadata

| Field | Value |
|---|---|
| ID | T-0306 |
| Title | Ready/Close Failure Guidance Improvement |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Add actionable remediation hints to ready/close/harness blockers. | Issue codes remain stable; hint fields are additive JSON. |

## Scope

| In Scope | Reason |
|---|---|
| `harness validate` issue hints. | Shared source for done-level readiness blockers. |
| `task ready` and `task close` issue propagation. | These reports should expose the same path/heading/fix guidance. |
| JSON schema fixtures and focused tests. | Lock additive compatibility. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Issue-code renames. | Consumers may depend on current codes. |
| Full `proof explain` parity. | Explicitly excluded by T-0306 acceptance. |
| Broad remediation execution. | This capsule only improves report guidance. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
