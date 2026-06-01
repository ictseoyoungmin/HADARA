# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.dashboard.timeline.v1` report builder exists. | Done | `src/services/dashboard-timeline.ts`. |
| AC-2 | `/api/timeline` route serves the report read-only. | Done | Dashboard route test covers `/api/timeline?taskId=T-0195`. |
| AC-3 | Timeline events are deterministic and sorted. | Done | Unit test asserts sequential event order. |
| AC-4 | Events include safe source metadata only. | Done | Unit test checks read-only events and no `.hadara/local` path leakage. |
| AC-5 | Private raw paths are not exposed. | Done | Timeline uses sanitized evidence list and safe summaries only. |
| AC-6 | Dashboard Workstream Panel can consume timeline events. | Done | Dashboard JS reads `/api/timeline` and renders events into Workstream. |
| AC-7 | Schema fixture / contract tests pass. | Done | Timeline schema is registered and schema fixture tests pass. |
| AC-8 | Full Docker validation passes. | Done | Docker sync-build passed with 80 files / 552 tests. |
