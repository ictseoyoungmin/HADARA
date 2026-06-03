# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Historical completed capsules may not have Done Status History rows. | Broad all-history validation could become noisy. | Medium | Scope the new gate to task-scoped done-level validation and repair only the current known T-0226 gap. | Mitigated |
| `task finish` could append duplicate Done rows. | Status History becomes noisy. | Low | Append only when the latest Status History status is not Done. | Mitigated |
| Missing/malformed Status History should not be silently papered over. | Broken capsules could pass finish without an audit trail. | Low | Finish refuses TASK.md sync if it cannot produce a final Done history row. | Mitigated |
| Shared Markdown section reader behavior can affect multiple protocol/read-model surfaces. | Existing consumers may depend on loose substring matching. | Low | Keep headings exact by caller-provided heading string, add focused coverage, and run full Docker validation. | Mitigated |
