# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consumers expecting default bootstrap to include full debt detail may see pending debt summary instead. | Medium | Low | Preserve `tier=full` for explicit full bootstrap and keep debt endpoints intact. | Mitigated |
| The timeout could be environment-sensitive and reappear under full publish helper load. | Medium | Medium | Focused dashboard-static now passes with the route test at 945ms; publish clone should be refreshed before publish retry. | Mitigated |
| Status route may under-report debt by design after this change. | Low | Medium | Dashboard clients fetch debt separately; `/api/debt` and `/api/dashboard/debt` remain available. | Accepted |
