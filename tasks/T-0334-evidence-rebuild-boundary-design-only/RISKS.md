# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docs imply a supported `evidence rebuild` command. | Operators may try unsupported runtime behavior. | Medium | Explicitly state no rebuild preview/execute exists in 0.3.2 and avoid adding command examples. | Mitigated |
| Rebuild guidance treats `EVIDENCE.md` as canonical. | Future tooling could rewrite or validate against a derived summary. | Medium | Document `evidence.jsonl` as canonical and Markdown as non-canonical. | Mitigated |
| `wouldChange` wording is too broad. | Future previews may report noisy or unsafe changes. | Medium | Require drift classes before reporting `wouldChange`. | Mitigated |
