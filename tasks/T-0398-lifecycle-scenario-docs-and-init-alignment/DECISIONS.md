# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `finish -> ready -> close -> audit-close` as the canonical lifecycle sequence in docs. | Accepted | The convenience commands are additive; proof boundaries stay visible and reviewable. | `ev:T-0398:7226b21db0564b008a4a8dc3` |
| D-2 | Present `task finalize --execute --plan-hash` as optional guarded workflow compression. | Accepted | Agents can reduce command churn after reviewing a stable plan without hidden writes or stale-plan execution. | `ev:T-0398:9f630cc9e133415495f689c2` |
| D-3 | Update generated init source alongside root docs. | Accepted | New HADARA projects should inherit the same lifecycle ergonomics as this repository. | `ev:T-0398:7226b21db0564b008a4a8dc3` |
