# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Duplicating the same rule block across docs could create drift. | Future operators may follow conflicting guidance. | Medium | Added concise tier sections and tests for root/generated docs. | Mitigated |
| Accidentally changing required-reading JSON behavior in T-0307 would blur capsule scope. | T-0308 acceptance would become unclear. | Low | Kept code changes limited to documentation strings and tests. | Mitigated |
