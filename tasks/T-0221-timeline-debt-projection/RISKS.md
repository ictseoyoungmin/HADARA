# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation was previously blocked. | TypeScript/Vitest regressions could have remained before the follow-up validation window. | Medium | Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; validation gap is closed for this follow-up. | Closed |
| Legacy `/api/timeline` and `/api/debt` still compute live reads. | Old consumers can still hit heavy request-time paths. | Medium | New Phase 5.7 routes are projection-first; frontend migration in T-0222 should switch consumers. | Open |
| Manual background refresh can still be slow on NTFS. | Refresh completion may lag when an operator explicitly triggers `/api/dashboard/refresh`. | Medium | Serve-start no longer runs the heavy projection path immediately; manual refresh yields between task/heavy/core stages; status route exposes missing/refreshing metadata and future core refactor can offload heavy scans. | Mitigated |
