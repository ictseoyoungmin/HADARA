# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Overlap with done-level harness validation creates contradictory diagnostics. | Agents may not know which command to trust. | Medium | Kept protocol doctor advisory/read-only and task-scoped; done-level harness remains the completion gate. | Mitigated |
| Issue codes become too broad for later remediation. | T-0156 safe remediation planning would be harder. | Medium | Added specific codes for requested drift classes. | Mitigated |
| Historical legacy capsules are treated as broken solely for not using v2 frames. | Project-wide doctor could produce noisy results later. | Low | Placeholder drift checks are limited to obvious scaffold content when a task appears Done. | Mitigated |
