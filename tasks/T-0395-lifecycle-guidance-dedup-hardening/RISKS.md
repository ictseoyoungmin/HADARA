# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Successful close dry-runs may appear to skip validation. | Operators could misunderstand the proof model. | Low | Validation fields still show the checks and hashes; only redundant next actions are removed. | Mitigated |
| Downstream lifecycle/complete-flow selection may rely on close actions. | Could break higher-level reports. | Medium | Focused tests include `task-lifecycle`, `task-complete-flow`, and `task-ready`. | Mitigated |
| Existing closed task smoke can become stale when new task work changes Task Board/source hash. | Built smoke may recommend append close evidence for the previous task. | Medium | Treat as expected close-source drift after new work starts; T-0395 close proof becomes the latest valid proof. | Accepted |
