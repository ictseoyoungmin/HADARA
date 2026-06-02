# T-0218 Dashboard Core Route from Projection

## Metadata

| Field | Value |
|---|---|
| ID | T-0218 |
| Title | Dashboard Core Route from Projection |
| Status | Draft |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Serve `/api/dashboard/core` from cheap sources and cached projection summaries. | The core route must avoid broad task-capsule scans on the request path. |

## Scope

| In Scope | Reason |
|---|---|
| Add core route and service over `hadara.dashboard.core.v1`. | First actionable dashboard read. |
| Build core from Task Board, Handoff, Project State, and projection summaries. | Keep request path bounded. |
| Add tests proving no all-capsule scan in core route. | Performance shape is the contract. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Background refresh implementation. | T-0219. |
| Incremental task projection. | T-0220. |
| Frontend migration. | T-0222. |

## Status

Draft

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for core route from projection. | Task created by HADARA CLI. |
