# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat temp-prefix installed-bin execution as canonical installed-package proof when global PATH or `npx` cache may be stale. | Accepted | It proves the package installed into an isolated prefix and executes the expected bin path. | Phase 8.3 spec; T-0317 F-1. |
| D-2 | Keep governed `REFACTOR_LOG.md` generated and registered, but remove it from default Required Reading. | Accepted | The registry classifies it as historical/never-default, so default reading should not include it. | T-0317 F-2; docs registry seed. |
| D-3 | Scope docs doctor Required Reading drift checks to actual Required Reading sections in AGENTS/SOP. | Accepted | Whole-file backtick scans can misclassify structure/reference mentions as Required Reading. | T-0317 F-2 investigation. |
