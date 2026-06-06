# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive readiness field could be missed by dashboard fast projections. | Type/schema drift in dashboard APIs. | Medium | Export shared readiness builder and use it in dashboard task-detail. | Mitigated |
| Direct lookup could return the first duplicate task directory if duplicates exist. | Ambiguous task identity. | Low | Existing task-create collision guard reduces duplicates; full list path remains available for list/audit workflows. | Accepted |
| Docker JSON diagnostics could reveal sensitive logs. | Privacy boundary regression. | Low | Only step id, exit code, and generic debug hint are emitted; raw logs remain omitted. | Mitigated |
| Parallel dashboard-static focused run may timeout under worker contention. | Noisy validation result. | Medium | Standalone dashboard-static passes quickly; T-0274 reduced single-task read overhead and records the contention as test-environment noise. | Monitored |
