# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Dashboard/TUI consumers infer semantics from raw text. | UI proof status can drift from CLI gates. | Medium | Explicitly require semantic read surfaces and lock with docs test. | Mitigated |
| Contract implies implemented UI/API fields too early. | Consumers may assume a non-existent route or inline workbench field. | Medium | Document current source as evidence lint and future workbench fields as additive. | Mitigated |
| Private evidence paths leak in UI. | Sensitive local/private paths could be exposed. | Low | Contract forbids private raw path exposure. | Mitigated |
