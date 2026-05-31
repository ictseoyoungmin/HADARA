# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Schema becomes too strict before consumers stabilize. | Future text/TUI/dashboard prep could require unnecessary schema churn. | Medium | Keep additive schema with stable envelope requirements only. | Mitigated |
| Runtime validation sees undefined optional fields. | Raw service objects could fail while JSON output passes. | Medium | Strip undefined optional action fields in action builder. | Mitigated |
