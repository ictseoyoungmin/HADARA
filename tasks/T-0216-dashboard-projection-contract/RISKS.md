# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Contract grows too broad and reintroduces heavy bootstrap semantics. | Projection work may fail to achieve request-path speedup. | Medium | Core schema is limited to first actionable state plus optional summaries; heavy projection work remains in later capsules. | Mitigated |
| Bootstrap compatibility is underspecified. | Current dashboard consumers could break during transition. | Medium | `/api/dashboard/bootstrap` compatibility is documented as additive/transition-safe. | Mitigated |
| Freshness enum semantics are vague. | Frontend may mislabel stale/offline data as live. | Medium | Explicit `freshness`, `completeness`, `refreshState`, `pendingSections`, and `staleSections` are schema-backed. | Mitigated |
