# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Ignore task-like directories without `TASK.md` in Task Capsule read/discovery surfaces. | Accepted | `TASK.md` is the source document that makes a directory a Task Capsule; adding a fake T-0073 Task Board row would preserve local garbage as project state. | `src/task/task-capsule.ts`; `command:T-0324:built-advisory-smokes` |
| D-2 | Preserve `nextTaskId` directory-based collision avoidance. | Accepted | ID allocation should still avoid colliding with local task-like leftovers even though read models ignore invalid capsule directories. | `tests/unit/task-create.test.ts`; `command:T-0324:focused-docker` |
| D-3 | Keep state consistency advisory for rc1 hardening. | Accepted | T-0323 intentionally exposed state warnings without strict release blocking; this capsule fixes an actionable false positive without changing gate policy. | `command:T-0324:built-advisory-smokes` |
