# Context

T-0100 exposed a practical failure mode: `docs/TASK_BOARD.md` had both a completed row and the initial appended Draft row for the same task id. Done-level validation should catch that before a task is considered complete.

Relevant code:

- `src/harness/validate.ts`
- `tests/harness/harness-validate.test.ts`
- `src/task/task-capsule.ts`
- `docs/TASK_BOARD.md`
