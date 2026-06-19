# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Spec-only work could be mistaken for implemented speed behavior. | Future agents may assume cache warm or graph cache reads already exist. | Medium | The spec and handoff explicitly state no implementation is included in this slice. | Open |
| Copying Graphify's committed generated-output model would violate HADARA cache boundaries. | Cache artifacts could become accidental truth or committed churn. | Low | The spec says HADARA absorbs manifest/update lessons only and keeps cache under `.hadara/local/cache/context/`. | Mitigated |
| Deferring C6 too long before C4 would make slicing correct but slow. | Agents may still resort to broad manual reads. | Medium | The spec blocks broad C4 slicing until C6.3 and explicit residual performance risk decisions exist. | Open |
