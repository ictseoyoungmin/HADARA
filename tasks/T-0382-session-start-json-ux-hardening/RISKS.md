# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| No-task Session Start changing from `ok:false` to `ok:true` surprises strict consumers. | Consumers using exit 6 as a missing-task signal may need to inspect issues/guidance instead. | Low | Keep `CONTEXT_PACK_TASK_NOT_FOUND` as a warning issue and expose `guidance.taskRequired:true`. | Mitigated |
| Guidance fields duplicate existing lifecycle command arrays. | JSON can feel noisy. | Medium | Keep arrays for compatibility and add compact structured guidance for machine consumers. | Accepted |
| UX hardening accidentally triggers live graph reads. | Mounted workspace performance could regress. | Low | Preserve bounded fallback and tests that snapshot project files/no writes. | Mitigated |
