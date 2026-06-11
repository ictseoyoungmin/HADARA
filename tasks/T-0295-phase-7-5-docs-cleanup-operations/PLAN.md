# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 7.5 spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/specs/0.3.0/06_Phase_7_5_Docs_Cleanup_Operations.md` |
| 2 | Add docs cleanup service for mark/archive/required-reading. | Done | `src/services/docs-cleanup.ts` |
| 3 | Add CLI surfaces and command registry entries. | Done | `src/cli/docs.ts`, `src/services/capability-registry.ts` |
| 4 | Extend docs doctor cleanup warnings. | Done | `src/services/docs-registry.ts` |
| 5 | Register schemas and focused tests. | Done | schemas and `tests/unit/docs-*.test.ts` |
| 6 | Run validation, attach evidence, close, and commit. | Done | `EVIDENCE.md` |
