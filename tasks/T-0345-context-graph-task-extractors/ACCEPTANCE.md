# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `extractTaskBoard()` reads `docs/TASK_BOARD.md` and emits Task nodes plus a task-board `StateSource`. | Done | `src/context/task-extractors.ts`; `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| AC-2 | `extractTaskCapsules()` reads `tasks/T-*/TASK.md` and `HANDOFF.md` and emits Task nodes plus task-capsule `StateSource` records. | Done | `src/context/task-extractors.ts`; `tests/unit/context-graph-task-extractors.test.ts`. |
| AC-3 | Missing Task Board degrades to a warning issue instead of throwing. | Done | `tests/unit/context-graph-task-extractors.test.ts`. |
| AC-4 | Focused and full Docker validation passed, and workspace `dist` was refreshed. | Done | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| AC-5 | No docs registry, command registry, evidence extractor, graph builder, task context builder, or CLI/read surface was added. | Done | Diff scope and out-of-scope notes. |
