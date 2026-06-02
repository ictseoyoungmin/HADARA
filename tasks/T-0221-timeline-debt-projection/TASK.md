# T-0221 Timeline / Debt Projection

## Metadata

| Field | Value |
|---|---|
| ID | T-0221 |
| Title | Timeline / Debt Projection |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Maintain dashboard timeline and debt summaries as projections. | Timeline/debt must stop triggering full request-time reads. |

## Scope

| In Scope | Reason |
|---|---|
| Move timeline summary generation into background projection. | Activity feed should read cached projection. |
| Move debt summary generation into background projection. | Debt counts should not block core response. |
| Expose stale/missing metadata for projected heavy sections. | UI can label partial reads honestly. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Core route. | T-0218 prerequisite. |
| Frontend merge. | T-0222. |
| Live streaming/SSE/WebSocket. | Deferred/non-goal. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for timeline/debt projection. | Task created by HADARA CLI. |
| 2026-06-02 | Done | Added background timeline/debt projection materialization, projection-first dashboard heavy routes, metadata status, and focused tests; follow-up Docker sync-build and close audit passed. | `evidence.add-command` at 2026-06-02T07:35:28.157Z; audit-close at 2026-06-02T07:37:27.871Z. |
