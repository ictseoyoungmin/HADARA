# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/task/task-capsule.ts` | Update | Remove generated HANDOFF `CloseState` row and harden `findTaskCapsule()` same-id leftover handling. | Done |
| `src/harness/validate.ts` | Update | Reject persisted task-local HANDOFF `CloseState` rows at done-level validation. | Done |
| `src/services/state-projection.ts` | Update | Surface persisted `CloseState` as derived-state drift and update fix hints. | Done |
| `src/cli/init.ts` | Update | Keep generated init workflow/SOP guidance aligned with derived CloseState policy. | Done |
| `tests/unit/task-capsule.test.ts` | Update | Assert new HANDOFF scaffolds omit `CloseState`. | Done |
| `tests/harness/task-capsule.test.ts` | Update | Cover same-id leftover directory plus later real capsule discovery. | Done |
| `tests/harness/harness-validate.test.ts` | Update | Cover persisted `CloseState` blocker. | Done |
| `tests/unit/state-projection.test.ts` | Update | Expect clean handoff `closeState:null` and persisted CloseState drift warnings. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Update | Document that CloseState is derived and not stored in close-source HANDOFF. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Update | Mirror close-source HANDOFF CloseState guidance. | Done |
| `docs/specs/0.3.1/` | Update | Align Phase 8 specs with TaskStatus-only handoff storage. | Done |
| `tasks/T-0320-*/HANDOFF.md` through `tasks/T-0325-*/HANDOFF.md` | Update | Remove stale persistent `CloseState` rows from recent Phase 8 task handoffs. | Done |
| `docs/TASK_BOARD.md` | Update | Track T-0325 lifecycle status through finish. | Done |
| `docs/PROJECT_STATE.md` | Update | Record T-0325 completion and adjusted Phase 8 state. | Done |
| `docs/AGENT_HANDOFF.md` | Update | Record latest task, next step, validation baseline, and residual risks. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Update | Correct T-0320 summary and add the T-0325 cleanup slice. | Done |
