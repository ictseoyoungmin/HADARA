# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Generated docs still imply direct harness validation is the completion path. | New HADARA users may skip the ready/finish/close/audit flow. | Medium | Replace generated SOP/TEST_STRATEGY wording and lock with init tests. | Mitigated in patch; pending validation. |
| Current docs understate PyPI publish status. | Operators may repeat publish setup or believe PyPI remains unreserved. | Medium | Update README, Project State, and PyPI runbook to say `hadara==0.2.0rc1` is published. | Mitigated in patch; pending validation. |
| Overwriting historical task records. | Completed capsule evidence would become inaccurate. | Low | Keep T-0276/T-0278 historical “no upload ran” statements unchanged. | Mitigated. |
| Docker validation is unavailable or slow. | Completion evidence may need a narrower validation path. | Low | Run focused init tests first, then full Docker sync-build if feasible; record any gap. | Open. |
