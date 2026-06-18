# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Regex extraction misses complex language syntax. | Some imports/exports may be omitted until a parser-backed implementation exists. | Medium | Covered spec-listed patterns first and left unsupported language features as future hardening. | Mitigated |
| Relative resolution creates noisy warnings for external packages. | Reports become degraded for valid package imports. | Low | Warn only for unresolved relative imports; keep external specifiers as raw imports without warnings. | Mitigated |
| Symbol extraction boundary blurs into this capsule. | Larger blast radius and harder review. | Medium | Kept `symbols` empty and deferred `CodeSymbolNode` generation to the next C2 capsule. | Mitigated |
