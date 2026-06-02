# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Host dashboard bundle build still cannot run without local dependencies. | Host-local `npm run dashboard:build` remains unavailable if `node_modules` is absent. | Medium | Docker dashboard build passed and rebuilt served HTML; use Docker workflow unless host dependencies are intentionally installed. | Mitigated |
| Full Docker validation was previously blocked. | TypeScript/Vitest regressions could have remained before the follow-up validation window. | Medium | Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; validation gap is closed for this follow-up. | Closed |
| Timeline backfill only updates when projection has events. | Missing projection leaves activity empty until refresh completes. | Medium | Projection status and T-0223 visual states should label missing/stale honestly. | Open |
| Core-first source cannot help if the served bundle is stale or the server event loop is blocked by warmup. | Users may still see slow first paint even though authored source reads `/api/dashboard/core` first. | Medium | Docker dashboard build rebuilt served HTML and T-0219 follow-up changed serve-start warmup to delayed core-only refresh. | Mitigated |
| Selected capsule detail can regress to global live reads. | A single detail click could show a long skeleton and then unavailable if it waits on full task workbench/timeline scans. | Medium | Follow-up changed task-detail aggregation to use selected-task fast workbench data and a task-scoped timeline; built smoke returned T-0223 detail in 1852 ms with `ok:true`. | Mitigated |
