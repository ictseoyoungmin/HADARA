# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task next --json` returns `hadara.task.next.v1`. | Done | `tests/unit/task-next.test.ts`; built CLI smoke evidence. |
| AC-2 | Development Slices are preferred over Task Board fallback. | Done | `tests/unit/task-next.test.ts`. |
| AC-3 | Missing planned capsules report a `createCommand` without creating files. | Done | `tests/unit/task-next.test.ts`. |
| AC-4 | Report includes required reading, source/reason, Task Board status/path, and capsule presence. | Done | `src/task/task-next.ts`; tests. |
| AC-5 | Evidence is attached and handoff is updated. | Done | T-0181 evidence records and HANDOFF.md. |
