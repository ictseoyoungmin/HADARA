# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Additive diagnostics accidentally imply cache is authoritative. | Operators could over-trust local derived cache. | Medium | Wording recommends explicit rebuild and preserves source-manifest/source-change reporting; cache remains lower authority than source. | Mitigated |
| Status command becomes slower by reading shard records. | Mounted status is already broad-manifest dominated; extra cache-record reads should be small but visible. | Low | Diagnostics only read small local cache records and do not compute live graph/code outputs. | Accepted |
| Diagnostics recommend a write command from a read report. | Agents might auto-execute warm without review. | Medium | Output uses structured args for operator review; no command is executed by status/dry-run warm. | Mitigated |
| Runtime latency remains high on mounted full-profile paths. | T-0383 slow probes remain unresolved. | High | T-0384 exposes slow-path metadata; T-0385 readiness cleanup can decide whether remaining latency is acceptable for 0.3.3. | Accepted |
