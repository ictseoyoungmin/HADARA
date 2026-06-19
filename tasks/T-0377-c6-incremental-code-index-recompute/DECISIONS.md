# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement C6 incremental/per-file code-index recompute before bounded C5 Session Start. | Accepted | Mounted live graph/pack paths remain too slow, and first code-index warm still rebuilds the whole index after T-0375. | `docs/AGENT_HANDOFF.md`; `docs/CONTEXT_ROUTING_PERFORMANCE_BASELINE.md` |
| D-2 | Preserve current deterministic code extraction behavior; cache per-file summaries instead of changing parser semantics. | Accepted | Speed is the current blocker; parser accuracy changes are separable and riskier. | C6 speed-first spec |
| D-3 | Keep per-file code-index writes behind explicit `context cache warm --execute`. | Accepted | C6 non-negotiable: read commands do not write cache. | C6 speed-first spec |
