# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| State projection still warns from another path | Context pack may still show PF-F-012 in installed projects. | Medium | Added source-metadata regression and reran PatternForge context pack after rebuild. | Mitigated |
| Suppressing needed handoff action after close | Missing handoff docs could be hidden. | Low | Only skip non-error handoff issues when `closed-valid`; error-level handoff issues remain actionable. | Mitigated |
| Focused tests miss broad release regression | Stable publish could still be premature. | Medium | Keep full Docker/release readiness for the next release capsule. | Carry Forward |
