# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Warm command might be mistaken for graph/code-index cache integration. | Operators may expect immediate graph speedups. | Medium | Report/docs state phase 1 writes only source manifest; next shards remain future scope. | Mitigated |
| Execute writes local cache in the working tree. | Untracked ignored local files may appear in local filesystem. | Low | `.hadara/local` is ignored; command writes only through atomic project-boundary helper. | Mitigated |
| Full Docker validation may be slow. | Could delay completion. | Medium | Ran full Docker check and sync-build successfully. | Closed |
| Fresh cache checks remain metadata-scan bound. | Mounted worktrees can still see about 10s fresh status/warm checks over 4k+ sources. | High | Captured as residual C6.4/C6.5 work for shard fingerprints/watch/index acceleration; cache is not treated as truth. | Open |
