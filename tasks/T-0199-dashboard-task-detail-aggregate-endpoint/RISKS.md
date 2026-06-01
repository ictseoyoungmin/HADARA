# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Detail response is richer than bootstrap. | Selected-task reads can still be heavier on very large capsules. | Medium | T-0201 adds process-memory TTL cache; T-0202 covers degraded UX/performance budget. | Accepted |
| Timeline evidence identity still uses fallback ids. | Evidence timeline rows may not yet expose durable semantic identity. | Medium | T-0200 is dedicated to timeline identity hardening. | Deferred |
| Existing old detail routes remain. | External consumers can still fan out if they choose old APIs. | Low | Contract documents aggregate route as preferred; compatibility routes stay read-only. | Accepted |
