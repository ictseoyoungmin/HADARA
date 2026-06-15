# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Phase 8 specs become too broad and hard to implement. | Future workers may open oversized capsules that mix docs, runtime, and release behavior. | Medium | Split rc1 into small phase specs with explicit non-goals and validation per capsule. | Mitigated |
| New status terminology conflicts with current CLI task status tokens. | Validators may reject valid existing tasks or conflate task completion with close proof. | Medium | Keep `TaskStatus` persistent and `CloseState` derived; do not use `Closed` as a task status. | Mitigated |
| Completed 0.3.0 specs remain default reading. | Workers may follow obsolete 0.3.0 implementation instructions while planning 0.3.1. | Medium | Remove completed 0.3.0 rows from active SOP Required Reading and add Phase 8 rows. | Mitigated |
| This planning capsule accidentally implies runtime implementation is complete. | Users may expect `state verify` or stricter validation to exist. | Low | Mark all new runtime surfaces as planned and reserve implementation for future capsules. | Mitigated |
