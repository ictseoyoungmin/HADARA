# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registry hint metadata becomes stale when handlers move. | Code routing can point agents to old files. | Medium | Hints are filtered to discovered indexed files; missing files produce no edge. | Mitigated |
| Heuristic handler fallback overclaims precision. | Agents may trust guessed command links as explicit proof. | Medium | Fallback links use `heuristic` confidence and source-addressed reasons. | Mitigated |
| Test-file hints are mistaken for full test relation coverage. | Consumers may assume all relevant tests are known. | Low | Handoff and shared docs point to test relation edges as the next separate C2 capsule. | Mitigated |
