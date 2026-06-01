# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard aggregate cache keys include a redacted project fingerprint. | Done | Unit tests assert `dashboard:sha256:<12hex>:...` keys and project-root isolation. |
| AC-2 | Browser-facing aggregate reports include redacted project source references while preserving v1 compatibility. | Done | Bootstrap/task-detail/timeline schemas and tests validate `projectRootRedacted` and `source.project.fingerprint`. |
| AC-3 | Sidebar navigation tabs beyond Home change dashboard view state and visible sections. | Done | Static dashboard test asserts `data-view-target`, `data-view-section`, and `activateDashboardView`. |
| AC-4 | Dashboard remains read-only and no new write/execution surface is added. | Done | Existing static read-only tests and Docker full validation passed. |
| AC-5 | Evidence is attached. | Done | `evidence.add-command` recorded Docker sync-build success. |
| AC-6 | Handoff is updated. | Done | `HANDOFF.md` records current state and carry-forward warnings. |
