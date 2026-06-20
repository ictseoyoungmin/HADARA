# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Repair classification could drift from `task audit-close` semantics. | Agents may follow the wrong close repair path. | Medium | Compose the existing close/audit reports and cover not-closed, stale, invalid, duplicate, and valid states in tests. | Mitigated |
| A convenience command could imply hidden writes. | Weakens HADARA proof boundaries. | Low | Command is explicitly read-only, registered as read-only, and built smoke confirmed `readOnly:true`. | Mitigated |
| Mounted-workspace lifecycle reports are not instant because they compose close/validation read models. | Agent ergonomics improve, but repeated use can still be slower than a pure metadata read. | Medium | Keep command read-only and use it when repair state is ambiguous; performance optimization remains separate from this correctness slice. | Accepted |
