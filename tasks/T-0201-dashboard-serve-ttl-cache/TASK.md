# T-0201 Dashboard Serve TTL Cache

## Metadata

| Field | Value |
|---|---|
| ID | T-0201 |
| Title | Dashboard Serve TTL Cache |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add process-memory TTL cache behavior for dashboard aggregate reads. | Bootstrap, task-detail, and timeline API reads should report cache metadata and support `?cache=bypass` without introducing persistence, mutation, browser project-state storage, or a database/file-watcher dependency. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard cache service. | Centralizes process-memory TTL semantics, cache metadata, bypass behavior, and test reset support. |
| `/api/dashboard/bootstrap`, `/api/dashboard/task-detail`, and `/api/timeline` route cache wrapping. | Keeps shared read-model builders pure while making served aggregate responses cache-aware. |
| Cache metadata schemas and tests. | Consumers need stable `hit`/`miss`/`stale`/`bypass`/`disabled` interpretation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Persistent cache, `.hadara/local` writes, browser storage, file watchers, database, polling, streaming, mutation, shell/provider/MCP writes. | Phase 5.5 cache is read-only, best-effort process memory only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | Capsule created with `hadara task create`. |
| 2026-06-01 | Done | Dashboard aggregate route TTL cache implemented and validated. | Docker sync-build passed with 83 files / 560 tests and built CLI smoke `ok:true`. |
