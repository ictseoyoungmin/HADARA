# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Removing Scope/Out of Scope weakens task boundaries. | Agents may under-specify work boundaries. | Medium | Require Goal, Acceptance, Source Documents, and Validation before lifecycle entry. | Open |
| Read authority rules are too strict for real debugging. | Agents may avoid needed reads. | Low | Allow files explicitly returned by read models, active capsule docs, and referenced shared docs. | Open |
| Keeping capsule open could leave shared state temporarily pointing at an unfinished task. | Next worker may assume docs are final. | Medium | Operator accepted closure on 2026-06-30; shared state now points to T-04A1 registration next. | Closed |
