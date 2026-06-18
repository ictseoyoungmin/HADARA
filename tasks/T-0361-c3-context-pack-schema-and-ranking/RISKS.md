# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Ranking can become another broad project scan if it rebuilds graph/code repeatedly. | Slow context pack would conflict with C6 goals. | Medium | Builder accepts an injected graph report/cache and only builds graph once when needed. | Mitigated |
| Context pack could over-select required reading and recreate current token waste. | C3 would not improve agent startup. | Medium | Enforce `maxReadFirstItems` default 7, optional `maxItems`, and warning-level budget truncation. | Mitigated |
| Adding public CLI too early could lock in a weak UX. | Future C3/C4 changes might need compatibility churn. | Low | Keep this capsule internal schema/ranking only; expose CLI in the next C3 capsule. | Mitigated |
| Slice candidates could imply C4 is implemented. | Users may expect actual source slicing. | Low | Keep actual `context slice` out of scope and emit only `sliceCandidates` metadata. | Mitigated |
