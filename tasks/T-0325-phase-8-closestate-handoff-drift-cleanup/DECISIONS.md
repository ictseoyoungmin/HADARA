# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Remove persistent `CloseState` from task-local HANDOFF current-state tables instead of renaming it. | Accepted | A close-source document cannot reliably store a value that becomes accurate only after close evidence is appended. | Reviewer feedback; `docs/TASK_WORKFLOW_COMMANDS.md` |
| D-2 | Keep `task close --execute` close-evidence-only. | Accepted | Updating HANDOFF during close would expand the command write boundary and create source-hash ordering complexity. | `docs/TASK_WORKFLOW_COMMANDS.md`; validation policy |
| D-3 | Treat persisted HANDOFF `CloseState` as done-level validation drift. | Accepted | Workers should repair the field before close rather than preserve a known stale value. | `src/harness/validate.ts`; focused tests |
| D-4 | Fold the `findTaskCapsule()` same-id leftover edge case into this cleanup capsule. | Accepted | It is a small, directly related hardening of task state projection/discovery coherence. | `src/task/task-capsule.ts`; `tests/harness/task-capsule.test.ts` |
