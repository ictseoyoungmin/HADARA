# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Contract grows too broad and reintroduces heavy bootstrap semantics. | Projection work may fail to achieve request-path speedup. | Medium | Keep core contract limited to first actionable state and projection metadata. | Open |
| Bootstrap compatibility is underspecified. | Current dashboard consumers could break during transition. | Medium | Document `/api/dashboard/bootstrap` as compatible/additive while `/core` is introduced. | Open |
| Freshness enum semantics are vague. | Frontend may mislabel stale/offline data as live. | Medium | Define explicit `freshness`, `completeness`, `refreshState`, `pendingSections`, and `staleSections`. | Open |
