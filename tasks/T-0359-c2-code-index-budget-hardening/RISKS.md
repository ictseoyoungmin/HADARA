# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Budget truncation could make graph output look complete when it is partial. | Agents may trust incomplete context. | Medium | Emit warning issues and set `summary.degraded:true`; graph integration maps code-index issues to graph degraded issues. | Mitigated |
| Hardcoded budgets could be too rigid for tests or future operators. | Tests become slow or future tuning requires invasive changes. | Low | Keep public defaults hardcoded but allow internal options for tests; defer public CLI flags to C6 cache/performance work. | Mitigated |
| Total byte accounting could require reading all files before enforcing limits. | Large files can still cause unnecessary memory reads. | Medium | Use `fs.statSync` before full file reads and skip over-budget files with explicit issues. | Mitigated |
