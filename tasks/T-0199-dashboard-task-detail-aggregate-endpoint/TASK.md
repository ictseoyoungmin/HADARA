# T-0199 Dashboard Task Detail Aggregate Endpoint

## Metadata

| Field | Value |
|---|---|
| ID | T-0199 |
| Title | Dashboard Task Detail Aggregate Endpoint |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add selected-task dashboard detail aggregate endpoint and bind the frontend to it. | Collapse selected-task workbench/evidence/timeline fan-out behind one read-only route. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.dashboard.task_detail.v1` service/schema. | Contract-visible aggregate over existing selected-task read models. |
| `/api/dashboard/task-detail?taskId=` route. | Served dashboard API surface for selected-task detail. |
| Frontend selected-task detail read path. | Browser should call the aggregate route instead of multiple Phase 5 detail routes. |
| Tests and docs. | Lock route, schema, proof semantics, and no-private-path boundaries. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Timeline identity hardening. | T-0200 scope. |
| TTL cache. | T-0201 scope. |
| Removing legacy Phase 5 detail routes. | They remain for compatibility; frontend stops using them. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create "Dashboard Task Detail Aggregate Endpoint"` |
