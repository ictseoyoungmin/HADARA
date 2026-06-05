# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task finish --execute` no longer leaves trailing blank EOF lines in generated `TASK.md`. | Done | Regression assertion added to task finish execute test. |
| AC-2 | Dry-run planned after-hash and execute write content use the same normalization rule. | Done | Normalization happens inside `nextWriteContent()`, used by planning and execute. |
| AC-3 | Focused lifecycle tests, full Docker check, and built lifecycle smoke are recorded. | Done | Focused Docker wrapper passed task-finish/schema tests; Docker sync-build passed 100 files / 673 tests; built smoke verified no trailing blank EOF. |
| AC-4 | Evidence is attached. | Done | `ev:T-0267:223330c2b282401a8c713525`. |
| AC-5 | Handoff is updated. | Done | Shared handoff records T-0267 and carries release candidate freeze forward. |
