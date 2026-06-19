# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Session Start accidentally performs full manifest or graph scans by default. | Mounted workspace startup can hang again. | Medium | Use cached manifest + fast freshness proof only; if unavailable, fallback to bounded no-live. | Mitigated |
| Warm cache output is stale. | Agent reads wrong routing context. | Low | Require fresh source manifest fast proof and shard sourceSubsetHash validation before consuming graph/code shards. | Mitigated |
| Read command writes local cache. | Violates C6 cache boundary. | Low | Snapshot tests around Session Start and no use of warm execute in read path. | Mitigated |
