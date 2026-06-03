# T-0196 Dashboard Timeline Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0196 |
| Title | Dashboard Timeline Read Model |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add deterministic read-only dashboard timeline read model and API route. | The dashboard Workstream should consume `hadara.dashboard.timeline.v1` through `/api/timeline` without polling, streaming, persistence, or mutation. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.dashboard.timeline.v1` service report | Required by T-0196. |
| `/api/timeline` read-only route | Dashboard needs a local read API for workstream events. |
| Dashboard Workstream binding | UI should consume timeline events when available. |
| Schema fixture and tests | Timeline consumers need a registered fixture-level contract. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Polling/SSE/live stream | Deferred beyond Phase 5 core. |
| Event persistence or browser local storage | Dashboard remains read-only and non-persistent. |
| Shell/provider/MCP calls or writes | Forbidden by dashboard boundary. |
| Private raw path exposure | Timeline events must use safe metadata only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | Created with `task create`. |
| 2026-06-01 | Done | Completed dashboard timeline read model. | Historical capsule alignment for Status History done gate. |
