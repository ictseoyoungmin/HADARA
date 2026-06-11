# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 7.4 spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/specs/0.3.0/05_Phase_7_4_Managed_Sections_and_Safe_Patch_Plans.md` |
| 2 | Add managed section parser/service and patch plan/apply engine. | Done | `src/services/managed-sections.ts` |
| 3 | Add `docs managed list/explain` and `docs patch` CLI surfaces. | Done | `src/cli/docs.ts` |
| 4 | Add safe init markers for generated target docs. | Done | `src/cli/init.ts`, `src/task/task-capsule.ts`, `src/task/task-templates.ts` |
| 5 | Register schemas and focused tests. | Done | `src/schemas/docs-patch-plan.schema.json`, `tests/unit/managed-sections.test.ts`, `tests/unit/docs-patch.test.ts` |
| 6 | Run validation, attach evidence, close, and commit. | Pending | close evidence |
