# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Lint schema breaks consumers. | Dashboard/MCP/TUI consumers drift. | Medium | Keep `hadara.evidence.lint.v1` and add `summary.semantics` only additively. | Mitigated |
| Draft tasks get semantic blockers too early. | Operators see noisy lint failures before work is complete. | Medium | Gate semantic issues on task Done state while still reporting summaries. | Mitigated |
| Failed evidence free text is treated as resolved. | Real failures could be hidden by vague wording. | Medium | Require exact markers, later passed same-category evidence, or residual-risk docs; test free-text-only wording. | Mitigated |
| Private evidence paths leak through normalized records. | Committed or displayed output could expose local/private paths. | Low | Do not add normalized records to the lint payload in this slice. | Mitigated |
