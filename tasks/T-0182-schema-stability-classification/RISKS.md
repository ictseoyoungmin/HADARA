# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consumers mistake fixture schemas for strict release gates. | Could block additive evolution prematurely. | Medium | SCHEMAS.md explicitly says classification is documentation-first. | Mitigated |
| Compatibility aliases remain ambiguous. | New consumers may keep depending on legacy fields. | Medium | Mark `state.closed` as compatibility alias and name preferred fields. | Mitigated |
| Classification drifts from schema metadata. | Docs and schema annotations could disagree. | Low | Add focused docs/schema alignment test. | Mitigated |
