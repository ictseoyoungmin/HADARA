# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| `handoff update --json` could be mistaken for a dry-run. | Consumers might assume no write occurred. | Medium | Report uses `writeBoundary:"shared-doc"` and docs describe it as a write command. | Mitigated |
| Table parser could mask malformed Project State tables. | Bad tables might still degrade to prose fallback. | Low | Parser selects exact `Phase` first-cell row and falls back only if absent. | Mitigated |
| Doctor context file check is stricter than `.hadara/` directory existence. | Fresh projects show missing until Hermes context export runs. | Medium | This matches the actual missing artifact and gives a concrete path. | Accepted |
| task status closed-valid/current readiness clarity remains unresolved. | Operators can still see valid close proof with stale current readiness after later failed evidence. | Medium | Defer to T-0274 lifecycle readability capsule. | Carry Forward |
| Lifecycle command latency remains unresolved. | Mounted workspace operations can feel hung. | Medium | Defer to T-0274 performance/root-cause capsule. | Carry Forward |
