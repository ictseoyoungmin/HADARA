# Risks

| Risk | Mitigation |
|---|---|
| Preflight is mistaken for approval or execution. | Report is read-only and does not call write helpers; CLI wording and tests assert no mutation. |
| Expected paths drift from actual writes. | Reuse existing task slug/id helpers where possible and cover current write families with tests. |
| Deferred run-state/debt writes imply implementation exists. | Add warning issues for deferred write families and keep actual mutation out of scope. |
| Generated filenames cannot be known before execution. | Use explicit placeholder segments for timestamps and ids instead of allocating them during preflight. |
