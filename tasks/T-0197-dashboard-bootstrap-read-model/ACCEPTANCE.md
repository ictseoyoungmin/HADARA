# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `/api/dashboard/bootstrap` returns `hadara.dashboard.bootstrap.v1`. | Done | `dashboard-static.test.ts` route assertion and `dashboard-bootstrap.test.ts` schema validation. |
| AC-2 | Report includes status, task summary, timeline overview, active-run summary, and debt summary where available. | Done | `createDashboardBootstrapReport()` composes status, task summary, timeline overview, active-run summary, and debt summary. |
| AC-3 | Optional selected-task summary is compact and does not include raw evidence artifacts or full evidence lists. | Done | Selected-task test asserts compact proof metadata and absence of `records`/`evidencePath`. |
| AC-4 | Route is GET/HEAD only and read-only. | Done | Dashboard API helper keeps API methods to GET/HEAD and route only calls read-model services. |
| AC-5 | Missing or invalid selected task degrades with issues instead of throwing. | Done | Invalid selected-task test covers `T-9999` degraded report with `SELECTED_TASK_UNAVAILABLE`. |
| AC-6 | Focused and full Docker validation pass, with evidence attached. | Done | Public command evidence appended at `2026-06-01T07:22:20.338Z`. |
