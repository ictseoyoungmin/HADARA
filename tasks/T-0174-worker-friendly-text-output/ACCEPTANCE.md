# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task status` text output is grouped by State, Evidence, Protocol, Close, and Suggested next. | Met | `task-workbench` unit test asserts section labels. |
| AC-2 | `task audit-close` text output is grouped by State, Close Evidence, Audit, and Suggested next. | Met | `task-close` unit test asserts section labels. |
| AC-3 | JSON report contract remains unchanged. | Met | Existing schema/workbench tests continue to pass. |
| AC-4 | Evidence is attached. | Met | `EVIDENCE.md` and `evidence.jsonl` contain focused/full/status-smoke command-log evidence. |
| AC-5 | Handoff is updated. | Met | Task and project handoffs updated. |
