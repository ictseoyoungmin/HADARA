# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Read command accidentally warms code-index cache. | Violates C6 read/write boundary. | Medium | Writes are only in `context cache warm --execute`; graph builder tests snapshot the project before/after read. | Mitigated |
| Whole code-index shard is still costly to warm. | First warm can remain slow on mounted workspaces. | Medium | This task targets warm read speed first; per-file incremental recompute remains a follow-up after fresh shard reuse exists. | Accepted |
| Stale code-index shard is treated as fresh. | Code-aware graph/session-start can route stale source links. | Medium | Validate against source manifest subset hash and extractor version; stale test proves live fallback. | Mitigated |
| Cache metadata hides graph-core plus code-index mixed state. | Callers cannot tell whether code came from cache or live extraction. | Medium | Cache metadata now uses explicit modes such as `graph-core+code-index` and `graph-core+live-code` with shard counts/paths. | Mitigated |
| Full-repo include-code graph still reports unresolved JSON import warnings. | Code-index graph can be degraded even when cache persistence works. | Medium | Kept out of this shard persistence slice; resolver support for `.json` imports should be handled in a later code-index quality capsule. | Open |
