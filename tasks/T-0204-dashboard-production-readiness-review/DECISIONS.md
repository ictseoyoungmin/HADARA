# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat T-0204 as an audit/review capsule. | Accepted | Phase 5.5 feature slices are complete; final pass should reduce ambiguity rather than add new behavior. | `docs/DASHBOARD_PRODUCTION_READINESS_REVIEW.md` |
| D-2 | Leave `hadara.dashboard.cache_status.v1` unregistered for now. | Accepted | It is metadata-only and internal to the served dashboard; register later if external consumers need it. | Residual risk table |
