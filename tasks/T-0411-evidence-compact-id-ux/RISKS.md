# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Text output may hide details needed by automation. | Low | Medium | JSON output retains full compact records, full tags, latest, latestCloseEvidence, and copyHints. | Mitigated |
| Close evidence detection may miss legacy records without `close-proof` tags. | Low | Low | Also treats audit-category records with close text as close evidence; detailed list remains available. | Mitigated |
| Full repository validation remains heavier than this capsule needs. | Medium | Medium | Ran Docker build, focused evidence tests, schema fixture test, built CLI smokes, and diff check. | Accepted |
