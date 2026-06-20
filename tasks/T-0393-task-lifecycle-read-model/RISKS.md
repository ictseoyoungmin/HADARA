# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Lifecycle report could drift from canonical command behavior. | Agents might follow wrong next actions. | Medium | Compose existing finish/ready/close/audit reports instead of reimplementing readiness. | Mitigated |
| Read-only API could accidentally write while gathering state. | Violates lifecycle convenience boundary. | Low | Service tests snapshot task files around report generation; CLI smoke observed read-only output. | Mitigated |
| Mounted workspace latency is still visible because lifecycle composes several existing scans. | Agents get a correct report but not a fast one on `/mnt/f`. | Medium | Record as a follow-up finding; T-0393 keeps behavior scoped and T-0394/T-0395 can optimize or split repair guidance. | Tracked |
| Close repair taxonomy is present but not fully fixture-tested for stale/invalid cases. | Future consumers could over-trust repair details. | Medium | T-0394 is dedicated to close repair plan coverage and classifications. | Deferred |
