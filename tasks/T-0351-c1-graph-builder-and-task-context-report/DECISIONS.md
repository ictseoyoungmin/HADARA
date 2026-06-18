# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Keep `T-0351` as an internal builder capsule, not a CLI capsule. | Accepted | The C1 extractors and schemas need one stable composition point before command wiring, persistence, and cache invalidation are introduced. | ev:T-0351:8783d5087eed426ca228ce02 |
| D2 | Accept injected extraction results in the builder API while also providing default extractor collection. | Accepted | Injection keeps tests deterministic; default collection proves all implemented extractors are reachable through one runtime path. | ev:T-0351:8783d5087eed426ca228ce02 |
| D3 | Derive task context from graph nodes, graph edges, and state projection without inventing new edge vocabulary. | Accepted | Preserves the C1 schema contract and avoids adding unreviewed relationship semantics. | ev:T-0351:8783d5087eed426ca228ce02 |
