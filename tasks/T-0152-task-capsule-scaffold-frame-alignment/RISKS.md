# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| New scaffold breaks existing harness assumptions. | High | Medium | Keep legacy marker support and focused harness regressions. | Mitigated |
| Evidence table shape changes break evidence append/read flows. | Medium | Medium | Update append behavior and focused evidence table tests. | Mitigated |
| Phase 2 plan is only copied into one doc and later agents miss details. | Medium | Low | Split summary into roadmap/backlog/test/schema docs and preserve detailed contract in implementation schemas. | Mitigated |
| T-0152 grows into protocol doctor implementation. | Medium | Low | Keep doctor/remediation/schema work deferred to T-0153 through T-0157. | Mitigated |
