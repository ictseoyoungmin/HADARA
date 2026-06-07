# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Generated docs become too HADARA-dev-specific. | New projects inherit irrelevant workflow guidance. | Medium | Keep generated `TASK_WORKFLOW_COMMANDS.md` generic and avoid release/dashboard/MCP defaults. | Mitigated |
| Basic profile references optional standard/governed docs. | Fresh small projects get missing-doc required reading. | Medium | Preserve profile-aware rows and test basic profile absence of optional docs. | Mitigated |
| Init doctor misses lifecycle scaffold drift. | Old/new mixed scaffolds pass as current. | Medium | Treat `docs/TASK_WORKFLOW_COMMANDS.md` as a core generated doc and add missing-doc regression. | Mitigated |
