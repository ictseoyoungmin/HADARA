# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `TuiReadModel.selectedTask` carries `hadara.dashboard.task_detail.v1` data from `createDashboardTaskDetailReport()`. | Done | `src/tui/read-model.ts`; focused TUI tests passed. |
| AC-2 | Selected task evidence/proof in TUI summary prefers shared dashboard task-detail/evidence data over TUI-local evidence Markdown heuristics. | Done | `src/tui/snapshot.ts`; built snapshot displayed shared proof text. |
| AC-3 | TUI remains read-only and does not call Dashboard HTTP routes. | Done | Implementation imports shared services directly; no HTTP client or write behavior added. |
| AC-4 | Focused TUI tests, full Docker sync-build, and built snapshot smoke pass or residual risk is recorded. | Done | Focused TUI tests passed 4 files / 46 tests; Docker sync-build passed 91 files / 595 tests; built snapshot smoke passed but remained slow at 42.56s. |
| AC-5 | Capsule evidence, project docs, and handoff are ready for the standard finish/close/audit workflow; git commit follows close before T-0230 starts. | Done | Evidence and project docs updated; finish/close/audit workflow is next. |
