# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Regex symbol extraction misses complex/multiline exports. | Some exported symbols may be absent from the first code index. | Medium | Covered spec-listed single-line patterns first; parser-backed extraction remains future hardening. | Mitigated |
| Export-list kind inference is wrong. | Symbol kind may be inaccurate. | Medium | Export-list aliases use `unknown` kind rather than guessing. | Mitigated |
| Symbol edges are mistaken as proof. | Agents may over-trust code links. | Low | Shared docs and handoff keep C2 links scoped as routing hints and leave command/test/graph proof to later capsules. | Mitigated |
