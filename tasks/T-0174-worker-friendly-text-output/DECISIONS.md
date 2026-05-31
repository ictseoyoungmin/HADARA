# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0174-1 | Keep text output as grouped summaries over existing report objects. | Accepted | Avoids a second source of truth and keeps full details in JSON. | Text section tests. |
| D-0174-2 | Add an audit-close formatter in task-close rather than inline CLI printing. | Accepted | Keeps presentation reusable and testable. | `formatTaskAuditCloseReport` unit coverage. |
