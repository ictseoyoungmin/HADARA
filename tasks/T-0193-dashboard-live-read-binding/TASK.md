# T-0193 Dashboard Live Read Binding

## Metadata

| Field | Value |
|---|---|
| ID | T-0193 |
| Title | Dashboard Live Read Binding |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Convert the served dashboard to live-read-first status loading. | The dashboard should try `/api/status` first, then fixture fallback, then inline fallback, while displaying source provenance and preserving read-only behavior. |

## Scope

| In Scope | Reason |
|---|---|
| `/api/status` primary frontend fetch | T-0193 is the live binding slice. |
| Fixture and inline fallback | Dashboard must remain usable without the live API. |
| Source provenance badge/subtitle | Operators must know whether data is live, fixture, or offline fallback. |
| Manual `Refresh Status` control | Refresh means read-again only, not run/sync/update. |
| Live/fallback tests | The binding order and provenance behavior need regression coverage. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Layout redesign | Reserved for T-0194. |
| Selected-task evidence lens | Reserved for T-0195. |
| Timeline read model | Reserved for T-0196. |
| Polling, SSE, or websocket updates | Deferred beyond Phase 5 core. |
| Any write, shell, provider, MCP, release, or remediation behavior | Dashboard remains a read-only projection. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | Created with `task create`. |
