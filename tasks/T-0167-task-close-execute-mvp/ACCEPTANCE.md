# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task close --execute` appends canonical close evidence only when blockers pass. | Met | `tests/unit/task-close.test.ts`. |
| AC-2 | Execute mode does not update task status, Task Board, Project State, or handoff. | Met | Implementation scope and tests. |
| AC-3 | Evidence is attached through canonical writer. | Met | Built CLI execute smoke appends close evidence. |
| AC-4 | Handoff is updated. | Met | T-0167 handoff file and project handoff. |
