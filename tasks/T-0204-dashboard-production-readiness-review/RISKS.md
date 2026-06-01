# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Review is documentation-backed, not browser-automation-backed. | Some UI runtime regressions could still slip. | Medium | Static tests plus full Docker pass now; add Playwright only if future visual runtime changes justify it. | Accepted |
| Cache status report remains unregistered schema. | External consumers cannot strict-validate it yet. | Low | Documented as residual risk; report exposes metadata only. | Accepted |
