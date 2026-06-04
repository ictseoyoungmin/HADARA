# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Advisory is mistaken for release readiness. | Users may treat Python smoke as a blocker/pass condition. | Medium | Include `blocking:false` and summary text explaining npm remains primary. | Mitigated |
| Python discovery promotes Python primary implicitly. | Scope creep into release target configuration. | Low | Do not change `releaseTargets.primary`; no auto promotion. | Mitigated |
