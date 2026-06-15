# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Projection duplicates existing protocol doctor logic too deeply. | More maintenance and slower reports. | Medium | Reuse lightweight source parsing and restrict deep task checks to latest Done and active tasks. | Mitigated |
| Report becomes a hidden gate before rollout policy exists. | Historical warnings could block unrelated work. | Medium | Keep T-0322 service-only and read-only; Phase 8.5 owns advisory exposure. | Mitigated |
| Missing optional docs break partial projects. | Projection is unusable outside HADARA-dev. | Low | Missing release readiness/docs registry produces warnings, not thrown errors. | Mitigated |
