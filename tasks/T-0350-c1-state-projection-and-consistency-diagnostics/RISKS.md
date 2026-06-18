# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
# Risks

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Compact C1 projection and existing Phase 8 `state verify` report could diverge semantically. | Operators may see inconsistent diagnostics between surfaces. | Keep T-0350 compact projection additive and preserve existing service tests; map only high-value C1 issues here. | Mitigated |
| State-source extraction from prose/table docs may over-parse non-task text. | False latest/active task mismatch warnings. | Normalize only explicit `T-XXXX` task ids and treat `None`/TBD values as absent where appropriate. | Mitigated |
| Close proof freshness is richer in the Phase 8 service than in extractor outputs. | Compact projection may only identify latest closed-task mismatch, not full hash drift. | Emit bounded `STATE_CLOSE_PROOF_STALE` when latest close proof does not match latest completed task; leave detailed hash proof to existing `state verify`/`audit-close`. | Accepted |
