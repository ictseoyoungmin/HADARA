# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full Docker validation was previously blocked. | TypeScript/Vitest regressions could have remained before the follow-up validation window. | Medium | Docker sync-build passed 90 files / 582 tests with built CLI smoke `ok:true`; validation gap is closed for this follow-up. | Closed |
| Refresh state is process-memory only. | Status resets when the dashboard server restarts. | Low | Local projection files remain the durable warm cache; T-0219 status is operational metadata only. | Accepted |
| T-0219 serve-start warmup now warms core projection only. | Heavy sections may remain pending until an explicit refresh or previously cached projection exists. | Medium | This is intentional to protect first dashboard requests from event-loop blocking; projection status reports missing/refreshing metadata. | Accepted |
| Manual `/api/dashboard/refresh` still has synchronous work inside each projection stage. | An operator-triggered refresh now yields between task, heavy, and core stages, but a single stage can still be expensive on very slow mounts. | Medium | Stage chaining no longer monopolizes the event loop for the entire full refresh; future core refactor can chunk task discovery/stat walks or offload projection rebuilds to a worker. | Tracked |
