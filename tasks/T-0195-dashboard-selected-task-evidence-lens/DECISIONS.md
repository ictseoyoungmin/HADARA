# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `/api/evidence-lint?taskId=` instead of changing `/api/evidence`. | Accepted | Existing `/api/evidence` returns the evidence list contract; selected-task semantics need the lint report without breaking that route. | T-0195 implementation. |
| D-2 | Keep selected task state in memory only. | Accepted | Browser-persisted project state remains forbidden for dashboard. | Dashboard contract and Phase 5 spec. |
