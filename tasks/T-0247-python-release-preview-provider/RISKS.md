# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Ad hoc TOML parsing misses advanced metadata forms. | Medium | Medium | Scope parser to simple static strings and report unknown backend where ambiguous; no execution depends on it. | Mitigated |
| Planned command preview is mistaken for execution support. | High | Medium | Mark every planned command `willExecute:false` and keep `publishPlan` unsupported. | Mitigated |
