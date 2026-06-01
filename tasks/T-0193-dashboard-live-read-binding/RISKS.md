# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Fixture fallback is mistaken for live state. | Operator may trust stale/sample data. | Medium | Display source provenance badge, source subtitle, and fixture warning text. | Mitigated |
| Refresh button implies mutation. | Operator may think the dashboard runs checks or syncs task state. | Medium | Use `Refresh Status` label and tests for forbidden action wording. | Mitigated |
| Live fetch errors expose unsafe details. | Browser UI could show stack traces or internal paths. | Low | Show safe error strings only and keep server errors bounded. | Mitigated |
