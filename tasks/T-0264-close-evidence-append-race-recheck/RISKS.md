# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Two agents append the same close proof from the same old plan. | Duplicate close evidence can weaken close/audit signal quality. | Medium | Recompute close evidence write plan from latest `evidence.jsonl` immediately before append. | Mitigated |
| Execute-time recheck breaks changed-proof supersedes behavior. | Audit may point at the wrong latest close proof. | Low | Reuse existing `createCloseEvidenceWritePlan()` during execute so supersedes is recomputed from latest records. | Mitigated |
| New metadata breaks schema consumers. | External agents may reject close reports. | Low | Add optional `executeRecheck` field under existing `closeEvidenceWrite`. | Mitigated |
| Recheck is mistaken for full lock safety. | Multi-agent safety claim becomes overstated. | Medium | Document as local race recheck, not a global lock service. | Pending shared docs update |
