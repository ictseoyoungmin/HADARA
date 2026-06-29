# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| `AGENTS.md` grows back into a command cookbook. | Agents may duplicate stale CLI recipes instead of using `HADARA_WORKFLOW.md`. | Medium | Keep only reading/rules/reference guidance in AGENTS; put commands in workflow. | Mitigated |
| Workflow examples describe proposed commands as already available. | Implementers may run non-existent commands. | Medium | Keep proposed 0.4 commands labeled in the CLI audit and use wording that distinguishes current/proposed surfaces. | Mitigated |
| Removing Release Boundary from workflow hides safety. | External mutation commands could be treated as normal work. | Low | Keep the explicit operator-approval rule in AGENTS. | Mitigated |
