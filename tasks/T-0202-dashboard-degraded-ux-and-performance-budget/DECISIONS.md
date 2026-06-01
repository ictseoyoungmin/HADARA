# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make load phase visible through simple DOM chips. | Accepted | Operators need source/cache/load provenance without a new frontend framework. | `docs/design/dashboard/index.html` |
| D-2 | Keep performance budgets advisory and evidence-oriented. | Accepted | Wall-clock unit tests would be brittle across machines. | `docs/DASHBOARD_PERFORMANCE_BUDGET.md` |
| D-3 | Expose debug metadata through a read-only snapshot function only. | Accepted | Supports inspection without hidden execution or mutation. | `dashboard-static.test.ts` |
