# T-0374 C6 Graph Core and Context Pack Warm Path

## Metadata

| Field | Value |
|---|---|
| ID | T-0374 |
| Title | C6 Graph Core and Context Pack Warm Path |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Mounted-safe warm graph/pack path | Persist and consume non-code graph-core/context-pack cache shards so routine `context graph` and `context pack` reads can avoid live broad rebuilds when cache is fresh. |

## Scope

| In Scope | Reason |
|---|---|
| Graph-core shard persistence and read reuse | Needed before C5 session-start can call graph/pack by default on mounted workspaces. |
| Context pack warm read path | `context pack --task` currently rebuilds graph; it should consume fresh cached graph projection when available. |
| Cache metadata and degraded reporting | Callers must know whether output came from warm shards, live fallback, partial cache, or stale/missing cache. |
| Focused tests and built CLI smoke | Proves the read commands remain non-mutating and the warm path is real. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Code-index per-file shard persistence | C6.6 code-aware speed work remains a follow-up; this task may preserve existing include-code behavior. |
| Watchers or automatic hooks | Cache writes stay explicit through cache warm surfaces. |
| LLM/provider semantic extraction | C6 remains deterministic and local. |
| Committed cache artifacts | `.hadara/local/cache/context` remains local, ignored, and rebuildable. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Scope narrowed to C6 graph-core/context-pack warm path before C5. | T-0373 performance baseline |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
