# T-0368 C6.5 Fast Cold Build and Graph Hot Path

## Metadata

| Field | Value |
|---|---|
| ID | T-0368 |
| Title | C6.5 Fast Cold Build and Graph Hot Path |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add a fast freshness path for context graph/cache reads. | Make warm `context graph`/cache status avoid full source-manifest rebuilds when a git worktree fingerprint proves the cached source manifest is still fresh. |

## Scope

| In Scope | Reason |
|---|---|
| Source manifest fingerprinting | Persist a compact git worktree freshness fingerprint with source manifests. |
| Cache read resolution | Reuse a cached source manifest on read-only paths when the fingerprint is fresh, with explicit report metadata. |
| Context graph hot path | Route graph extraction cache orchestration through the same manifest resolution so C4 can depend on faster graph/pack reads. |
| Validation | Add focused unit coverage for fast hit and invalidation behavior, then run Docker validation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| C4 context slice CLI implementation | This task prepares the hot path that C4 will use; slice command behavior belongs to a follow-up C4 capsule. |
| Code index shard persistence | C6.6 handles code index cache persistence. |
| Watcher or background daemon | C6 remains command-bounded and deterministic. |
| Broad graph truncation policy | Node/edge cap semantics require a separate graph output contract pass. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-19 | In Progress | Scoped C6.5 fast source-manifest reuse for cache and graph read paths. | TASK/PLAN/DECISIONS/RISKS/FILES updates |
| 2026-06-19 | Done | Implemented git worktree source-manifest fingerprint reuse for cache status/warm and graph shard read orchestration. | `ev:T-0368:a2306de95f6b4741bf91c897` |
<!-- hadara:managed:end task-status-history -->
