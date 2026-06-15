# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-capsule.ts` | Update | Generate new HANDOFF current-state rows with `TaskStatus` and `CloseState`. | Done |
| `src/harness/validate.ts` | Update | Add done-level validators for handoff status drift, invalid close state, and PLAN `In Progress` rows. | Done |
| `tests/unit/task-capsule.test.ts` | Update | Assert new scaffold exposes TaskStatus/CloseState. | Done |
| `tests/harness/harness-validate.test.ts` | Update | Add regression coverage for stale handoff wording, invalid CloseState, and PLAN status drift. | Done |
| `tests/unit/task-ready.test.ts` | Review/Update | Ensure ready report propagates new harness issues. | Done |
| `docs/AGENT_HANDOFF.md` | Update | Route next work to Phase 8.3 after T-0320. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Update | Mark Phase 8.2 Done. | Done |
| `docs/PROJECT_STATE.md` | Update | Record Phase 8.2 completion. | Done |
| `docs/TASK_BOARD.md` | Update | Synchronize T-0320 through task lifecycle commands. | Done |
| `tasks/T-0320-phase-8-2-task-handoff-current-state-and-close-state-governance/*` | Update | Record scope, evidence, validation, and handoff. | Done |
