# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Generated `AGENTS.md` shows a compact default agent loop in the order `task next`, `session start`, `task lifecycle`, reviewed `task finalize`. | Met | ev:T-0416:54d2ca94759b4088ae2fbb7e, ev:T-0416:da44946c779d43bea82e4547 |
| AC-2 | Generated SOP and `TASK_WORKFLOW_COMMANDS.md` include `session start` in the standard loop and keep low-level proof-boundary commands as debugging/recovery surfaces. | Met | ev:T-0416:54d2ca94759b4088ae2fbb7e, ev:T-0416:da44946c779d43bea82e4547 |
| AC-3 | Focused init tests and built init smoke verify the generated docs. | Met | ev:T-0416:54d2ca94759b4088ae2fbb7e, ev:T-0416:da44946c779d43bea82e4547 |
| AC-4 | Evidence, handoff, and shared state docs are updated before finalize. | Met | ev:T-0416:54d2ca94759b4088ae2fbb7e, ev:T-0416:da44946c779d43bea82e4547 |
