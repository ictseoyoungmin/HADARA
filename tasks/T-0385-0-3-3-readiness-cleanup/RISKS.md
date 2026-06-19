# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Readiness wording overclaims release completion. | Future agents may skip T-0386/T-0387. | Medium | State that the core is ready for bounded/default consumption while T-0386/T-0387 remain. | Mitigated |
| Mounted broad-command latency is hidden by cleanup wording. | Operators may expect cache/graph/pack full reads to be fast on `/mnt/f`. | Medium | Keep explicit residual note and preserve bounded Session Start as the default guarantee. | Mitigated |
| Docs-only validation misses runtime regressions. | Runtime behavior could be assumed changed. | Low | Do not touch runtime/source; run stale-phrase and markdown/diff validation. | Mitigated |
