# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Parser tightening could change protocol issue output. | Existing docs/harness diagnostics might drift. | Medium | Preserve the existing permissive parser shape and run focused protocol plus full tests. | Mitigated |
| Helper grows beyond extraction scope. | T-0161 could accidentally change remediation semantics. | Low | Limit use to parsing imports and add formatting helpers only as tested utility functions. | Mitigated |
