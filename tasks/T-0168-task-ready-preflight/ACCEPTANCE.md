# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task ready --task <id> --level done --json` emits a read-only readiness report. | Met | Focused tests. |
| AC-2 | Report includes blocker summary, check booleans, and nextActions. | Met | `tests/unit/task-ready.test.ts`. |
| AC-3 | Evidence is attached. | Met | T-0168 evidence records. |
| AC-4 | Handoff is updated. | Met | T-0168 handoff and project handoff. |
