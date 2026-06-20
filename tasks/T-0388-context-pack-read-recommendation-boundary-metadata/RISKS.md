# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Consumers ignore the new metadata. | They may still treat all read recommendations as raw slice commands. | Medium | Documented the contract in context pack spec/schema docs and preserved sliceCandidates as the executable command list. | Mitigated |
| Metadata wording overstates safety. | Raw sliceability could be mistaken for write permission or semantic relevance. | Low | Used `rawSlice` naming and reason text that only covers context-slice raw reads. | Mitigated |
| Schema fixture drift. | Additive fields may not be validated by current tests. | Low | Updated schema item definition and focused context-pack tests. | Mitigated |
