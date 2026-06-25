# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat non-`closed-valid` audit verdicts as finalize audit-required even when audit has only warnings. | Accepted | Drift warnings mean close proof no longer matches current close-source files. | `src/task/task-finalize.ts` |
| D-2 | Route finalize drift guidance to `task close-repair-plan` instead of embedding a second repair planner. | Accepted | The repair-plan command already owns detailed repair classification and command sequence. | `tests/unit/task-finalize.test.ts` |
| D-3 | Align lifecycle phase with audit verdict, not just audit `ok`. | Accepted | Agents should see `repair-required` after post-close source edits. | `src/task/task-lifecycle.ts` |
