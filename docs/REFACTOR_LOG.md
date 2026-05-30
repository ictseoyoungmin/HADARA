# REFACTOR_LOG

## Format

| Date | Action | File/Module | Reason | Evidence |
|---|---|---|---|---|
| 2026-05-30 | Refactored init scaffold generation into table-first generic templates | `src/cli/init.ts`, `tests/unit/init.test.ts`, `README.md`, root HADARA tracking docs | Apply `docs/specs/HADARA_Init_Refactoring_Phase1_Development_Plan.md`: generated docs preserve HADARA structure without HADARA-dev optional integration assumptions, profile references stay generated-doc-aware, README separates optional integrations, and generated `.gitignore` no longer ignores top-level `data/`. | T-0149 evidence: focused init tests passed with 10 tests, full Docker `npm run check` passed with 57 files / 412 tests, built CLI init smokes passed for `basic`, `standard`, and `governed`, and done-level harness validation returned `ok: true`. |
| 2026-05-30 | Completed init follow-up maintenance commands and lazy runtime-store behavior | `src/cli/init.ts`, `src/cli/main.ts`, `src/services/capability-registry.ts`, `tests/unit/init.test.ts`, README and HADARA tracking docs | Finish the remaining Phase 1 init refactoring follow-ups: scaffold doctor, profile upgrade, Required Reading registration, optional integration enablement, and avoiding eager local/private runtime-store directory creation. | T-0150 evidence: focused init tests passed with 14 tests, full Docker `npm run check` passed with 57 files / 416 tests, built CLI follow-up smoke passed, and done-level harness validation returned `ok: true`. |
