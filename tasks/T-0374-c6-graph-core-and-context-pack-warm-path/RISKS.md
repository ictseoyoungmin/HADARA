# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Cache read path accidentally becomes a write path. | Violates C6 non-negotiables and can make cache look authoritative. | Medium | Keep writes only in `context cache warm --execute`; add no-write read tests. | Mitigated |
| Graph-core shard becomes stale but is treated as fresh. | C5/session-start could route wrong context. | Medium | Validate shard against manifest/subset hash and extractor versions; fall back live with explicit metadata. | Mitigated |
| Scope expands into code-index persistence. | Capsule becomes too large and delays non-code mounted speed unblock. | Medium | Keep `--include-code` behavior compatible and defer per-file code cache to a follow-up. | Mitigated |
| Warm path output shape diverges from live graph. | Downstream context pack/slice consumers could regress. | Medium | Reuse existing graph report payload shape and run context pack/slice-adjacent tests. | Mitigated |
