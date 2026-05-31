# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | AGENTS.md context, project state, handoff, task board, implementation SOP, development slices. |
| 2 | Implement `task finish` service/CLI/schema. | Done | `src/task/task-finish.ts`, `src/cli/task.ts`, `src/schemas/task-finish.schema.json`. |
| 3 | Add focused regression coverage. | Done | `tests/unit/task-finish.test.ts`, schema fixture test update. |
| 4 | Run Docker validation and built CLI smoke. | Done | `npm run dev:docker-sync-build` passed; built CLI task finish dry-run/execute smokes passed. |
| 5 | Update capsule/project handoff and close. | Done | Capsule handoff and project docs updated before close. |
