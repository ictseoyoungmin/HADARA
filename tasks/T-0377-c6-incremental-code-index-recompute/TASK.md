# T-0377 C6 Incremental Code Index Recompute

## Metadata

| Field | Value |
|---|---|
| ID | T-0377 |
| Title | C6 Incremental Code Index Recompute |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Reduce first/stale code-index warm cost | Make explicit `context cache warm --execute` reuse unchanged per-file code-index extraction summaries so code-heavy warm work is proportional to changed source/test files instead of always rebuilding the whole code index. |

## Scope

| In Scope | Reason |
|---|---|
| Per-file code-index cache records or equivalent local shard | Required by C6 speed-first spec to avoid unchanged file parsing on warm execute. |
| Manifest-fed code-index recompute | Reuse the source manifest/source entries already produced by cache warm orchestration. |
| Stale/missing/corrupt per-file fallback | Cache is not truth; bad per-file cache must recompute affected files and report clear cache metadata. |
| Tests proving unchanged-file reuse and changed-file recompute | Avoid measuring-only optimization claims. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Parser rewrite or tree-sitter adoption | Accuracy improvements are separate; current deterministic extraction remains acceptable. |
| Read-command cache writes | `context graph`, `context pack`, and `context slice` must stay non-mutating. |
| Full C5 Session Start | Return to C5 only after code-index warm path is bounded enough. |
| Timing-sensitive CI performance gate | Use deterministic reuse/recompute assertions; benchmark measurements can remain observational. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Scope set to C6 per-file code-index recompute before C5 defaults. | handoff/spec routing |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
