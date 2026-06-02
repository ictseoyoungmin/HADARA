# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Start Phase 5.7 with a contract-only slice. | Proposed | Projection store, routes, and frontend merge should share one freshness/completeness vocabulary. | Phase 5.7 redesign spec. |
| D-2 | Keep `/api/dashboard/bootstrap` compatible while adding `/api/dashboard/core`. | Proposed | Existing dashboard behavior should not break during the projection transition. | Dashboard read-model contract. |
