# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Result/outcome split-brain could make Markdown and v2 semantics disagree. | Proof trust is weakened. | High | Reject incompatible explicit result/outcome pairs before append. | Mitigated |
| Failed/blocked records with exact markers could incorrectly resolve earlier failures. | Failed evidence could be hidden by later bad evidence. | Medium | Accept exact markers only from passed or recorded later evidence. | Mitigated |
| Evidence writer could append into a `TASK.md`-less leftover directory. | Evidence lands outside the real capsule. | Medium | Require `TASK.md` for writer task-dir candidates and reject ambiguous valid candidates. | Mitigated |
| Editing T-0330 handoff after close could stale its close proof. | Audit continuity could degrade. | Medium | Reran T-0330 ready/close/audit after the handoff cleanup; latest audit returned closed-valid. | Mitigated |
