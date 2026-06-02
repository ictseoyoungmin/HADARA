# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add new projection-first dashboard heavy routes instead of changing legacy routes immediately. | Accepted | Preserves compatibility while giving T-0222 a fast merge path. | `src/cli/dashboard.ts`. |
| D-2 | Sanitize timeline projection source before local write. | Accepted | Existing timeline report carries legacy raw `source.projectRoot`; projection storage must stay redacted. | `sanitizeTimelineProjection`. |
| D-3 | Store debt as a dashboard debt projection report. | Accepted | Core and frontend need compact debt aggregate/issue metadata, not the full legacy debt report body. | `DashboardDebtProjectionReport`. |
