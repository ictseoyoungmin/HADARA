# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat dashboard-named core/projection services as shared operator read models for TUI until a neutral rename is justified. | Accepted | Reuse removes Dashboard/TUI semantic drift without a broad rename. | `docs/specs/tui/HADARA_TUI_Shared_Operator_Read_Model_Spec.md` |
| D-2 | Keep T-0228 additive and defer full TUI detail/cache replacement. | Accepted | Replacing all legacy TUI read paths in one slice would be too broad; first make projection state visible and establish the architecture. | `PLAN.md` |
| D-3 | Add a no-write dashboard core option for TUI ordinary reads. | Accepted | TUI snapshots and read models must remain read-only for project documents and local projection writes unless refresh is explicit/service-owned. | `src/services/dashboard-core.ts` |
