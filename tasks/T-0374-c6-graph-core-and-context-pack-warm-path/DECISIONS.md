# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement non-code graph-core/context-pack warm path before code-index shard persistence. | Accepted | T-0373 showed mounted live graph/pack reads are the C5 blocker; code-aware speed remains next but should not delay graph-only session-start readiness. | T-0373 baseline; C6 speed-first spec |
