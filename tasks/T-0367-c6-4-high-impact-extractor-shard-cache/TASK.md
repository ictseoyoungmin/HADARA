# T-0367 C6.4 High Impact Extractor Shard Cache

## Metadata

| Field | Value |
|---|---|
| ID | T-0367 |
| Title | C6.4 High Impact Extractor Shard Cache |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add C6.4 high-impact extractor shard caching for context graph warm/read paths. | Make `context cache warm --execute` populate reusable graph extractor shards and make `context graph` consume fresh shards without writing files. |

## Scope

| In Scope | Reason |
|---|---|
| Cache record paths for `extractTaskBoard`, `extractDocsRegistry`, and `extractCommandRegistry`. | These shards are high-impact, low-risk, and directly useful for graph/pack routing. |
| Warm report shard planning and execute writes. | C6 warm must create usable projection shards, not only the source manifest. |
| Read-only `context graph` shard consumption with stale/corrupt fallback. | Graph/pack hot paths must be faster while preserving deterministic output. |
| Tests and schema-compatible additive report metadata. | Cache behavior must be verifiable and avoid breaking existing JSON consumers. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full C4 `context slice` command implementation. | C6.4 cache hot path should land first so C4 can reuse it. |
| Code-index shard persistence. | Code index caching is a larger C6.6 slice after extractor shard mechanics are proven. |
| Implicit cache writes from `context graph` or `context pack`. | Read commands must remain read-only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task.create |
| 2026-06-19 | In Progress | Scope fixed for C6.4 extractor shard warm/read path. | PLAN.md |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
