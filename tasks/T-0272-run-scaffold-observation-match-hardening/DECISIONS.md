# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Match `"status":"completed"` in generated second provider step. | Accepted | It is stable across stdout content, including newlines, and requires no ScriptedProvider behavior change. | Focused regression and built CLI smoke passed. |
| D-2 | Leave lower-priority T-0271 fresh-init/status/handoff findings for follow-up grouped capsules. | Accepted | T-0272 is scoped to the high-priority deterministic run bug. | T-0271 `FINDINGS.md` remains the tracking source. |
