# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Correct release-candidate line status before making the stable 0.3.2 decision. | Accepted | T-0338 is complete, and release readiness should not describe the installed-package recycle as active. | User request; `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `ev:T-0338:59d881bdd12749f6a3a1ea87` |
| D-2 | Choose stable `0.3.2` publish as the next release action. | Accepted | T-0336 readiness, T-0337 publish verification, T-0338 installed-package recycle, and T-0339 docker-compose dogfooding found no release-blocking issue; remaining findings are non-blocking UX follow-ups. | T-0336 evidence; T-0337 evidence; `ev:T-0338:59d881bdd12749f6a3a1ea87`; `ev:T-0339:49cceff9e094481a85b7b4b0`; `FINDINGS.md` |
