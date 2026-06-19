# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement whole-report code-index shard persistence before per-file incremental extraction. | Accepted | T-0374 established whole graph-core shard reuse first; fresh include-code graph reads need a read-only cache hit before finer changed-file recompute work. | C6 speed-first spec; T-0374 handoff |
| D-2 | Keep `context graph --include-code` read-only and fall back to live code extraction when the code-index shard is missing, stale, corrupt, or schema-mismatched. | Accepted | Cache is not truth; read commands must not silently refresh local derived state. | ev:T-0375:b292024f4a504e08b624f834 |
| D-3 | Reuse existing `CodeIndexReport` and `codeIndexReportToGraphExtraction` rather than adding a second projection shape. | Accepted | The existing report is schema-valid and already maps to graph/state sources, so a cache record wrapper is sufficient for C6.6. | ev:T-0375:b292024f4a504e08b624f834 |
