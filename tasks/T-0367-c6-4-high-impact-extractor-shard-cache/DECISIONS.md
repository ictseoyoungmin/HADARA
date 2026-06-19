# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement C6.4 as extractor-level cache records, not a monolithic graph cache. | Accepted | Per-extractor invalidation lets source-code changes avoid invalidating task/docs/command shards. | C6 spec |
| D-2 | Start with `extractTaskBoard`, `extractDocsRegistry`, and `extractCommandRegistry`. | Accepted | These are stable, high-value routing sources with small source subsets. | CONTEXT.md |
| D-3 | Keep `context graph` and `context pack` read-only. | Accepted | Warm command owns local cache writes; graph/pack only consume fresh cache. | AGENTS.md / C6 spec |
