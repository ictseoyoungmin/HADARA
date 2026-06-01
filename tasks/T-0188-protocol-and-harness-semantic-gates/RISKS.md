# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Harness and lint semantics drift. | Operators see conflicting evidence gates. | Medium | Reuse `createEvidenceLintReport` semantic issues in harness done-level validation. | Mitigated |
| Private-only evidence blocks first rollout. | Valid but private proof cannot close. | Medium | Map private-only semantic issue as harness warning. | Mitigated |
| Historical docs-scope scan becomes noisy. | Old tasks block unrelated work. | Medium | Keep T-0188 task-scoped/done-level only. | Mitigated |
