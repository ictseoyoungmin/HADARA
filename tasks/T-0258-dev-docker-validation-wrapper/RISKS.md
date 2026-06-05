# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Raw Docker/npm logs could expose paths or environment details. | JSON output could leak machine-local state. | Medium | Report only step summaries/issues; set privacy booleans false and omit raw stdout/stderr. | Mitigated |
| Dist sync could happen unexpectedly. | Workspace built CLI could change without explicit operator intent. | Medium | Require explicit `--sync-dist`; default report does not copy `dist`. | Mitigated |
| Focused wrapper could be mistaken for full validation. | Operators might overstate evidence. | Low | Report `mode`, focused test paths, full-check boolean, and evidence summary. | Mitigated |
