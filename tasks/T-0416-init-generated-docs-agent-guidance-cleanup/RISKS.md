# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Generated docs become longer instead of clearer. | Fresh project onboarding could feel heavier. | Medium | Add one compact loop in `AGENTS.md` and reuse existing SOP/workflow sections rather than adding a new subsystem. | Mitigated |
| Tests overfit exact prose. | Future wording changes become harder. | Medium | Assert durable command order and key guidance, not the full generated document. | Mitigated |
| `session start` guidance appears before a task exists. | Agents might run task-scoped command without a task id. | Low | Keep `task next` first and retain task create/status path before task-scoped `session start`. | Mitigated |
