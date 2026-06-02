# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use one shared handoff parser for table/list sections and validation baseline extraction. | Accepted | Prevents repeated fixes where core/status/timeline parse the same table differently. | `src/services/handoff-summary-parser.ts`. |
| D-2 | Dashboard debt projection uses static operational-debt aggregate only. | Accepted | Browser debt metric needs aggregate counts; full capsule-size and premature-acceptance scans belong to operational-debt/release surfaces. | `docs/specs/dashboard/HADARA_Dashboard_Refresh_Refactor_Spec.md`. |
| D-3 | Manual refresh stages run async and in finer projection phases. | Accepted | Keeps first actionable reads responsive and avoids hiding broad sync work inside combined heavy stages. | `src/services/dashboard-refresh.ts`. |
