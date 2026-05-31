# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs. | Done | Project state, handoff, task board, implementation SOP, development slices, CLI JSON contract, schema docs. |
| 2 | Implement task next service/CLI/schema. | Done | `src/task/task-next.ts`, `src/cli/task.ts`, `src/schemas/task-next.schema.json`. |
| 3 | Add focused regression tests. | Done | `tests/unit/task-next.test.ts`, schema fixture update. |
| 4 | Run validation and built CLI smoke. | Done | `npm run dev:docker-sync-build` passed; built CLI `task next` smoke passed. |
| 5 | Attach evidence and close. | Done | Evidence appended; close/audit pending immediately before commit. |
