# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Cache hit uses stale extractor payload after unrelated source changes. | Incorrect graph routing. | Medium | Validate cache records with extractor-specific subset hashes and extractor versions. | Mitigated |
| Read-only graph command writes local cache accidentally. | Violates command contract. | Low | Keep writes only in warm execute and assert snapshots in tests. | Mitigated |
| Warm executes expensive extractors and erases expected speed gains. | C6 value reduced. | Medium | Limit phase to low-cost high-impact shards and defer code index shard. | Mitigated |
| Corrupt shard crashes graph build. | User-facing context command failure. | Medium | Treat corrupt/schema-mismatch records as misses and run live extraction. | Mitigated |
