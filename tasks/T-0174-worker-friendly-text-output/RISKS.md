# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Text output becomes too verbose. | Operators may prefer JSON again for simple checks. | Medium | Keep only grouped summary and next commands in text mode. | Mitigated |
| Text output diverges from JSON source. | Human and machine views could disagree. | Low | Format directly from report objects. | Mitigated |
