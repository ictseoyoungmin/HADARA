# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement cache at the served dashboard API boundary. | Accepted | Keeps shared read-model services deterministic and easy to test while accelerating repeated dashboard reads. | `src/cli/dashboard.ts`, `src/services/dashboard-cache.ts` |
| D-2 | Bypass recomputes but does not replace the cached entry. | Accepted | Operators need a real fresh read without accidentally changing what a normal refresh would still hit. | `dashboard-cache.test.ts` |
| D-3 | Cache status route exposes metadata only. | Accepted | Supports observability without exposing cached report bodies or private paths. | `/api/dashboard/cache/status` route test |
