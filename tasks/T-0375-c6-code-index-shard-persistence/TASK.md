# T-0375 C6 Code Index Shard Persistence

## Metadata

| Field | Value |
|---|---|
| ID | T-0375 |
| Title | C6 Code Index Shard Persistence |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Code-aware warm graph path | Persist and consume a code-index shard so warmed `context graph --include-code` avoids live code index extraction when cache is fresh. |

## Scope

| In Scope | Reason |
|---|---|
| Code-index shard write/read support | C6.6 requires a persisted code index projection under `.hadara/local/cache/context`. |
| `context cache warm --execute` writes the shard | Cache writes must stay explicit and evidence-friendly. |
| `context graph --include-code` consumes fresh shard read-only | This removes the largest remaining code-aware mounted read risk after T-0374. |
| Focused tests and built CLI smoke | Proves cache hit/no-write behavior and keeps schemas stable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Per-file partial recompute | This capsule may persist the whole code-index report first; finer per-file invalidation can follow after the hot read path exists. |
| Parser-backed extraction | Regex/static extraction remains the deterministic C2 baseline. |
| Watchers or hooks | Cache writes remain explicit through warm execute. |
| New public `hadara code` CLI | Existing context graph/include-code surface is sufficient for this C6 slice. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Scope narrowed to whole code-index shard persistence before per-file incremental recompute. | T-0374 handoff; C6 speed-first spec |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
