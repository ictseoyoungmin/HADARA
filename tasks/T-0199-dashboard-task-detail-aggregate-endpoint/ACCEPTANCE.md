# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `/api/dashboard/task-detail?taskId=T-XXXX` returns `hadara.dashboard.task_detail.v1`. | Done | Route test covers `/api/dashboard/task-detail?taskId=T-0198`. |
| AC-2 | Missing taskId returns `hadara.dashboard.api.error.v1`. | Done | Dashboard static route-boundary test covers missing taskId. |
| AC-3 | Proof status derives from semantic issue codes and summary data. | Done | `createDashboardTaskDetailReport()` uses evidence lint semantic issues and summary. |
| AC-4 | `private-only` is warning/auditability, not blocker. | Done | Proof model exposes `auditabilityWarning` separately from `blocking`. |
| AC-5 | Frontend no longer calls workbench/evidence-lint/evidence/timeline separately for selected task. | Done | Static HTML test asserts aggregate route is used and old selected-task detail URL strings are absent. |
| AC-6 | No private raw paths are exposed. | Done | Detail service uses sanitized evidence list defaults and focused test checks `.hadara/local` is absent. |
