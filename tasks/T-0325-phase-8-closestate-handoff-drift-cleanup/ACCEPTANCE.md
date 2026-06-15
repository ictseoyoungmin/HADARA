# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | New Task Capsule HANDOFF scaffolds persist `TaskStatus` only and omit `CloseState`. | Done | `src/task/task-capsule.ts`; `tests/unit/task-capsule.test.ts` |
| AC-2 | Done-level validation rejects task-local HANDOFF `CloseState` persistence with actionable fix hints. | Done | `src/harness/validate.ts`; `tests/harness/harness-validate.test.ts` |
| AC-3 | State projection reports persisted `CloseState` as derived-state drift while clean handoffs report no stored close state. | Done | `src/services/state-projection.ts`; `tests/unit/state-projection.test.ts` |
| AC-4 | T-0320 through T-0325 recent handoffs no longer store stale `CloseState` rows. | Done | Phase 8 handoff docs |
| AC-5 | `findTaskCapsule()` skips same-id local leftovers without `TASK.md` and continues to find a later real capsule. | Done | `src/task/task-capsule.ts`; `tests/harness/task-capsule.test.ts` |
| AC-6 | Current workflow/generated docs and Phase 8 specs describe CloseState as derived read-model state. | Done | `docs/TASK_WORKFLOW_COMMANDS.md`; `docs/IMPLEMENTATION_SOP.md`; `src/cli/init.ts`; Phase 8 specs |
| AC-7 | Focused/full validation evidence is recorded and close-source docs are ready for lifecycle close/audit. | Done | `command:T-0325:*`; `task finish` |
