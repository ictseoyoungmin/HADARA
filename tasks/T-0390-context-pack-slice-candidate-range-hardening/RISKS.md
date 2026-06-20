# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Bounded fallback includes more text than a single line. | Candidate slices may return up to 81 lines for graph anchors without true end-line metadata. | Medium | The window remains below C4 line and byte budgets, and real ranges are preserved when present. | Mitigated |
| A consumer expected one-line candidate ranges. | Output metadata changes for candidates built from single-line graph anchors. | Low | One-line output was not useful for raw context; tests now lock the intended bounded behavior. | Mitigated |
| Mounted workspace validation remains slow. | Lifecycle work can take longer than implementation. | Medium | Full Docker sync-build completed and refreshed `dist`; evidence records exact result. | Mitigated |
