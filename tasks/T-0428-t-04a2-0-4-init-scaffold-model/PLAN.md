# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read T-04A2 source specs and current init implementation. | Done | `docs/specs/0.4.0/productization-redesign/01_Project_Scaffold_Model.md`, `src/cli/init.ts` |
| 2 | Replace the default init scaffold file set with the accepted 0.4 basic/standard/governed model. | Done | `src/cli/init.ts`, `src/services/docs-registry.ts` |
| 3 | Update focused init tests for scaffold metadata, registries, profile files, and doctor checks. | Done | `tests/unit/init.test.ts` |
| 4 | Run focused Docker build/test validation and refresh workspace `dist`. | Done | `ev:T-0428:f09b011734c84cab8034facf` |
| 5 | Update capsule/shared state docs, finalize, and commit. | Done | Shared state docs updated; close evidence pending from finalize. |
