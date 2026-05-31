# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Task finish planned writes include before/after hash metadata and expected existence. | Done | `tests/unit/task-finish.test.ts`. |
| AC-2 | Execute uses temp-file/rename with conflict/no-op guards and rollback-attempt behavior. | Done | `src/task/task-finish.ts`; Docker tests. |
| AC-3 | Malformed Task Board frames and broken TASK.md status frames block execute. | Done | `tests/unit/task-finish.test.ts`. |
| AC-4 | `task next` createCommand shell-quotes titles containing double quotes. | Done | `tests/unit/task-next.test.ts`. |
| AC-5 | Evidence is attached and handoff is updated. | Done | T-0184 evidence records and HANDOFF.md. |
