# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| High-level execute may obscure proof boundaries. | Agents might stop understanding which command wrote what. | Medium | Report keeps per-step write boundary, command, report hash, and execution status. | Mitigated |
| Stale plan hash could execute an old plan. | Wrong lifecycle writes. | Low | Execute recomputes the current plan and refuses mismatches before writes. | Mitigated |
| Ready or close blockers after finish could leave a partially completed lifecycle. | Task may be Done but not closed. | Medium | Execution is serial, reports `stoppedAt`, and stops before close evidence on blockers. | Mitigated |
| Future docs drift after close remains possible if shared docs are edited post-close. | Close evidence can become stale. | Medium | Finish close-source docs before finalize execute; rerun close/audit after intentional post-close edits. | Accepted |
