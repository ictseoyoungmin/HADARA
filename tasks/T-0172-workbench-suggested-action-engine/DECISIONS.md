# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0172-1 | Use a dedicated `WorkbenchNextAction` model instead of reusing close nextActions directly. | Accepted | Workbench actions need priority, source issue codes, remediation/audit kinds, and dry-run/execute pairing. | `workbench-next-actions` tests. |
| D-0172-2 | Keep action generation read-only. | Accepted | Phase 3 operator console should guide workers without mutating project state. | No command execution or write calls in the service. |
