# T-0197 Dashboard Bootstrap Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0197 |
| Title | Dashboard Bootstrap Read Model |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add `hadara.dashboard.bootstrap.v1` and `/api/dashboard/bootstrap`. | First-paint dashboard data should be available through one read-only aggregate route before frontend progressive loading work. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard bootstrap service. | Compose existing read models into a compact first-paint report. |
| Schema fixture and runtime registration. | Keep dashboard aggregate reports contract-visible. |
| `/api/dashboard/bootstrap` route. | Expose the aggregate through the served dashboard API with GET/HEAD only. |
| Optional compact selected-task summary. | Support `selectedTaskId` without deep evidence payloads or raw artifacts. |
| Source/cache metadata placeholder. | Prepare Phase 5.5 cache semantics while keeping T-0197 cache disabled. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| TTL cache implementation. | Planned for T-0201. |
| Frontend bootstrap rewrite. | Planned for T-0198. |
| Task-detail aggregate endpoint. | Planned for T-0199. |
| Polling, streaming, browser storage, or mutation behavior. | Forbidden or deferred by the Phase 5.5 spec. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | `hadara task create "Dashboard Bootstrap Read Model"` |
