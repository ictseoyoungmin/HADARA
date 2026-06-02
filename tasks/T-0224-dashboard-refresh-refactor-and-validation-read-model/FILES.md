# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `docs/specs/dashboard/HADARA_Dashboard_Refresh_Refactor_Spec.md` | Added | Strict design for validation extraction and dashboard refresh refactor boundaries. | Done |
| `src/services/handoff-summary-parser.ts` | Added | Shared table-first handoff section and validation baseline parser. | Done |
| `src/services/operations-status-service.ts` | Updated | Use shared validation/handoff parser so status does not fall back to old T-0096 history. | Done |
| `src/services/dashboard-core.ts` | Updated | Use shared validation/handoff parser for core projection. | Done |
| `src/services/dashboard-timeline.ts` | Updated | Allow overview timeline events to compose from fresh core without broad status/task-list scans. | Done |
| `src/services/dashboard-task-projection.ts` | Updated | Add async batched task projection refresh for manual dashboard refresh. | Done |
| `src/services/dashboard-heavy-projection.ts` | Updated | Split timeline/debt projection helpers and make dashboard debt projection aggregate-only. | Done |
| `src/services/dashboard-refresh.ts` | Updated | Run async staged refresh: task signals, core, timeline, debt, final core. | Done |
| `tests/unit/status-json.test.ts` | Updated | Regression for table-first validation baseline extraction. | Done |
| `tests/unit/dashboard-refresh.test.ts` | Updated | Regression for async staged refresh ordering. | Done |
| `tests/unit/dashboard-heavy-projection.test.ts` | Updated | Regression for no task scan on debt projection. | Done |
