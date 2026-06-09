# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| rc3 scope grows too large. | Release candidate becomes hard to validate and explain. | Medium | Keep rc3 limited to evidence writer hardening, proof MVP, CI gate MVP, and readiness/recycle evidence. | Open |
| Session bootstrap is prematurely promoted. | Implementation may chase unmeasured resume-cost pain. | Medium | Keep `session start` deferred until transcript-based measurement supports it. | Open |
