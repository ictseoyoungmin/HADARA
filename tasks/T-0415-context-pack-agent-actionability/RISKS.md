# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive schema field surprises strict consumers. | Consumers that incorrectly reject unknown fields may need updates. | Low | Schema is fixture-level and `additionalProperties:true`; docs call the field additive. | Mitigated |
| Suggested actions duplicate existing slice candidates. | Agents may see redundant commands. | Medium | Deduplicate by command args and cap slice actions to the top three. | Mitigated |
| Ranking bonus over-prioritizes task-local files. | A less relevant task-local file could outrank a more important broad doc. | Low | Bonus applies only to graph-connected nodes; required docs still remain in `readFirst`/`readIfNeeded`. | Mitigated |
| Mounted full-project live context pack remains slow. | Built CLI smoke on `/mnt/f` can exceed an interactive budget. | High | Classified as existing broad-read residual; T-0415 functional proof uses Docker focused tests and `/tmp` built CLI smoke. | Accepted residual, ev:T-0415:ac54506b4fc544969254a059 |
