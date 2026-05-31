# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docs could imply unsupported `--scope tasks`. | Agents may call an unsupported scope. | Low | Help/docs list `--task <id>` for task reports and `docs|profile|all` for `--scope`. | Mitigated |
| Help text could drift from README/schema docs. | New sessions get contradictory command surfaces. | Low | Built CLI help smoke and text search were used. | Mitigated |
