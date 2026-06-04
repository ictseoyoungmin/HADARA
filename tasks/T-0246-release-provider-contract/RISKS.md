# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release dry-run schema changes break existing consumers. | Medium | Medium | Additive `providerCapabilities` only; preserve current targets/current/readiness fields and update schema tests. | Mitigated |
| Python preview is misread as execution support. | High | Medium | Mark build/smoke/artifact/publish as unsupported and keep no command execution/token loading in T-0246. | Mitigated |
