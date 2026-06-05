# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Common schemas drift from embedded report usage. | Future Phase 6 reports may duplicate fields inconsistently. | Medium | Centralize TypeScript types in `src/core` and reuse them in T-0254+. | Mitigated |
| Operators assume actor CLI options already work on existing commands. | Confusing CLI usage before adoption. | Low | Docs say option names are for future Phase 6 commands and existing commands do not require them yet. | Mitigated |
