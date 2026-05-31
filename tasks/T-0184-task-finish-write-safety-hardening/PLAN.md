# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and existing write patterns. | Done | AGENTS.md context; protocol remediation and task upgrade scaffold safe-write patterns. |
| 2 | Harden `task finish` write planning and execute. | Done | `src/task/task-finish.ts`. |
| 3 | Shell-quote `task next` createCommand. | Done | `src/task/task-next.ts`. |
| 4 | Add focused regression coverage and run validation. | Done | `tests/unit/task-finish.test.ts`, `tests/unit/task-next.test.ts`; Docker check passed. |
| 5 | Attach evidence and close. | Done | Evidence appended; close/audit pending immediately before commit. |
