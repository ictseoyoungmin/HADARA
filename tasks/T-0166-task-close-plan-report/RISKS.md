# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Close plan looks like it performed close. | Agents may misunderstand dry-run output. | Medium | Report uses `mode: dry-run`, `closeEvidence.appended: false`, and explicit next action. | Mitigated |
| Execute flag accidentally writes too early. | Broad close semantics would be premature. | Low | `--execute` returns `TASK_CLOSE_EXECUTE_NOT_IMPLEMENTED` until T-0167. | Mitigated |
