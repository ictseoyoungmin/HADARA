# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Store `DashboardTaskDetailReport` on `TuiReadModel.selectedTask`. | Accepted | It makes the selected task aggregate explicit and keeps TUI proof/evidence semantics aligned with Dashboard without HTTP calls. | `src/tui/read-model.ts` |
| D-2 | Keep Task Capsule Markdown files for the existing document viewer in this slice. | Accepted | `createDashboardTaskDetailReport()` does not include document file bodies; removing viewer files now would break TUI detail tabs and broaden scope. | `RISKS.md` |
| D-3 | Preserve explicit private evidence behavior outside default dashboard detail evidence. | Accepted | Dashboard task-detail uses public evidence-list defaults; private evidence remains opt-in and should not be cached unintentionally. | `src/tui/read-model.ts` |
