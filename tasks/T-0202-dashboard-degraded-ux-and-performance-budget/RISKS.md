# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Static tests cannot fully simulate browser runtime failures. | Some degraded UX behavior may need Playwright later. | Medium | Assert deterministic hooks now; reserve deeper visual/runtime checks for final readiness review. | Accepted |
| Debug surface could grow into mutation helpers. | Governance boundary risk. | Low | Contract and tests require read-only snapshot semantics and no browser project-state persistence. | Mitigated |
