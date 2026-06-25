# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Agents may mistake warning-only audit drift for a completed task. | High | Medium | Finalize and lifecycle now use audit verdict to require repair when close-source drift exists. | Mitigated |
| Guidance could become too prescriptive and hide detailed repair context. | Medium | Low | Finalize routes to `task close-repair-plan`, which remains the detailed read-only repair surface. | Mitigated |
| Full suite not run for this narrow lifecycle change. | Medium | Medium | Docker build plus focused finalize/lifecycle tests and built CLI smokes were run. | Accepted |
