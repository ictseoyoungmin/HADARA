# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0235 implementation. | Done | `docs/AGENT_HANDOFF.md`, `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `src/services/evidence-migration.ts`. |
| 2 | Add hash-guarded execute mode while preserving dry-run preview. | Done | Implementation in `src/services/evidence-migration.ts` and CLI args. |
| 3 | Add focused tests for success, mismatch/no-write, and skipped-record refusal. | Done | `tests/unit/evidence-migration.test.ts`. |
| 4 | Run focused and full Docker validation. | Done | Focused 7 files / 67 tests; Docker sync-build 92 files / 606 tests. |
| 5 | Attach evidence and close the capsule. | Done | Evidence attached; ready/finish/close/audit-close passed. |
| 6 | Update project handoff/state docs. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/TASK_BOARD.md` updated. |
