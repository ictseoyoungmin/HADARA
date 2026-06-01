# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Stale cache could be mistaken for source-of-truth state. | Operators might overtrust cached responses. | Medium | Every cached route returns explicit cache metadata and supports `?cache=bypass`; cache is process memory only. | Mitigated |
| Cache mutation could leak into direct read-model tests. | Determinism could degrade. | Low | Direct service builders still return disabled cache metadata; route layer decorates responses. | Mitigated |
| Cache status route could expose sensitive payloads. | Private data exposure. | Low | `/api/dashboard/cache/status` exposes only keys and timestamps, not cached values. | Mitigated |
