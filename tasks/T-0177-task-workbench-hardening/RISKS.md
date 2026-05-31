# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive workbench fields drift from schema/docs. | Future consumers may parse stale fields or misread close state. | Medium | Update schema, CLI JSON contract, workbench read-model contract, and regression tests together. | Mitigated |
| Task Board warnings for other tasks become current-task remediation actions. | Operator could run an unrelated remediation command. | Medium | Gate Task Board remediation nextActions to issues whose message references the current task id. | Mitigated |
| `state.closed` compatibility alias is misread as old evidence-found semantics. | Consumer confusion during transition. | Low | Document `closedValid` as preferred and keep `closed` as a valid-close alias. | Mitigated |
