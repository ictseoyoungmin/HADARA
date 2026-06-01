# Dashboard Performance Measurement

Generated: 2026-06-01T09:04:14.529Z

Environment: Playwright Docker container against `hadara dashboard serve`.

Task id: `T-0204`

## Summary

| Item | Observed |
|---|---:|
| Shell load | 4.4 ms |
| Shell DOM bytes | 54178 |
| Dashboard runtime found | yes |

## Route Measurements

| Label | Route | Cache statuses | Min ms | Avg ms | Max ms |
|---|---|---|---:|---:|---:|
| bootstrap_uncached_bypass | `/api/dashboard/bootstrap?cache=bypass` | bypass, bypass, bypass | 172.5 | 174.7 | 177.4 |
| bootstrap_cache_miss_then_hit | `/api/dashboard/bootstrap` | miss, hit, hit | 1.5 | 62.6 | 184.6 |
| task_detail_uncached_bypass | `/api/dashboard/task-detail?taskId=T-0204&cache=bypass` | bypass, bypass, bypass | 228.4 | 243.3 | 256.4 |
| task_detail_cache_miss_then_hit | `/api/dashboard/task-detail?taskId=T-0204` | miss, hit, hit | 1.6 | 78.1 | 230.8 |
| timeline_uncached_bypass | `/api/timeline?taskId=T-0204&cache=bypass` | bypass, bypass, bypass | 148.8 | 150.4 | 152.5 |
| timeline_cache_miss_then_hit | `/api/timeline?taskId=T-0204` | miss, hit, hit | 0.9 | 50.7 | 150.2 |

## Budgets

| Budget | Target |
|---|---:|
| Shell load | 500 ms |
| Uncached bootstrap | 500 ms |
| Cached bootstrap | 50 ms |
| Uncached task detail | 800 ms |
| Cached task detail | 80 ms |

## Notes

- Measured inside Playwright Docker against hadara dashboard serve.
- Shell load is dashboard HTML fetch duration from the Playwright Docker container, not a browser paint metric.
- Route timings are Node fetch observations from the same container against the local dashboard server.
- Values are advisory observations, not brittle release gates.
- Cache hit samples are measured after the first normal read has populated the process-memory cache.
- A direct bind-mounted workspace run was not used for the final numbers because the dashboard server did not return promptly enough for a stable measurement; this report uses a minimal `/tmp` copy inside the Playwright Docker container.
