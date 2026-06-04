# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `task close --json` reports explicit lifecycle guidance that validation is pre-close, close evidence is excluded from the current validation loop, and execute/audit are the next phases. | Met | Focused task-close tests and built close dry-run smoke. |
| AC-2 | `task close --execute --json` continues to append only close evidence and reports that a read-only audit pass is required or recommended after append. | Met | Focused task-close execute test; write-boundary review. |
| AC-3 | `task audit-close --json` reports current versus recorded hashes and an audit verdict in structured fields. | Met | Focused task-close audit tests and built audit-close smoke. |
| AC-4 | Documentation, evidence, handoff, and Task Board state are updated through the standard task workflow. | Met | Evidence attached; Project State, Development Slices, Agent Handoff, Task Board, finish, close, and audit-close are complete. |
