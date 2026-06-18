# T-0364 C6.2 Cache Store and Status Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0364 |
| Title | C6.2 Cache Store and Status Read Model |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add the C6.2 cache store and read-only cache status foundation. | Let future warm/cache integration inspect source-manifest freshness cheaply without making read commands write local cache. |

## Scope

| In Scope | Reason |
|---|---|
| Context cache record/store helper. | Provides project-relative cache paths, schema-guarded reads, atomic temp+rename writes, and corrupt/missing diagnostics for future warm commands. |
| Read-only `context cache status --json` report. | Exposes manifest cache presence/freshness/stale extractor keys without writing `.hadara/local`. |
| Schema/runtime registration for cache status and cache record fixtures. | Gives future graph/code-index/cache consumers a documented C6 contract. |
| Focused unit/CLI tests. | Proves status, stale detection, corrupt cache handling, and no-write read command boundary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `context cache warm --execute` or any public cache write command. | Deferred so this slice keeps status read-only and write semantics can be designed separately. |
| Rewiring `context graph`, `context pack`, or code index to consume cache. | Deferred until the status/store contract is proven. |
| C4 `context slice`. | C4 should build after cache status/warm and graph/code-index fast paths are in place. |
| Filesystem watcher or automatic background writes. | Explicitly out of C6.2 scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
