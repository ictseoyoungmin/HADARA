# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consumers may treat `primaryNextAction` as an execute instruction. | Could skip dry-run review if misused. | Low | Docs and messages keep commands as suggestions; no command is executed by reports. | Mitigated |
| Shared-doc boundary metadata appears before shared-doc apply tooling exists. | Operators may expect an apply command for state docs. | Medium | Use review action and `requiresBeforeHash:true`; actual apply remains future dry-run-first work. | Open |
