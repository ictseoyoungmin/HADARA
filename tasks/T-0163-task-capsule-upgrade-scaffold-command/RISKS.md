# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Scaffold upgrade could duplicate semantic tables. | User docs become noisier. | Medium | Skip ambiguous non-canonical semantic frames with warnings. | Mitigated |
| Execute could overwrite user prose. | Loss of authored task context. | Low | Use append/create-only plans plus before-hash/existence checks. | Mitigated |
| New JSON surface could be undocumented. | External agents cannot rely on shape. | Low | Register fixture-level schema and runtime validation. | Mitigated |
