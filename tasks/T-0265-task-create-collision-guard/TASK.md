# T-0265 Task Create Collision Guard

## Metadata

| Field | Value |
|---|---|
| ID | T-0265 |
| Title | Task Create Collision Guard |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Make task create ID allocation safer under parallel creates. | Detect directory and Task Board collisions after candidate selection, retry bounded times, and fail with a clear issue code. |

## Scope

| In Scope | Reason |
|---|---|
| Retry when the selected task directory appears before mkdir. | Simulates another agent creating the same candidate after ID selection. |
| Skip task IDs already present in Task Board. | Prevents Task Board collision from producing an untracked duplicate. |
| Return a clear failure report when retries are exhausted. | External agents need actionable issue codes instead of silent duplicate behavior. |
| Preserve template behavior and Draft-only boundaries. | T-0259 task templates must remain compatible. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No task assignment service | Phase 6.1 scope boundary. |
| No durable global ID allocator | Phase 6.1 scope boundary. |
| No random task ID format migration | Future v2 task-id decision only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-05T08:46:30.000Z | In Progress | Started Phase 6.1 task create collision guard implementation. | Focused task-create/schema Docker validation passed after implementation. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
