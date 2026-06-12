# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Hint fields accidentally change existing issue codes. | Consumer regressions. | Low | Added fields without altering `code`, `message`, or severity behavior; focused tests passed. | Mitigated |
| Schema fixture work expands beyond the capsule. | Slows rc2 workflow hardening. | Medium | Added only the missing harness validation schema and updated ready/close issue shapes. | Mitigated |
| Hints become too verbose. | Reports become harder to scan. | Medium | Kept `fixHint` short and put structured detail in optional `remediationHint`. | Mitigated |
