# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C5/C6 specs. | Done | Read current state/handoff/task workflow docs plus `03`, `07`, and `08` context-routing specs. |
| 2 | Implement cache-only warm Session Start path. | Done | `src/context/session-start.ts` now checks a cached source manifest fast-freshness hit, then reads fresh graph-core/code-index shards read-only before falling back. |
| 3 | Add focused tests for warm graph-core/code-index consumption and no writes. | Done | `tests/unit/session-start.test.ts` covers warm graph-core hits, include-code code-index hits, and fallback when freshness cannot be proven. |
| 4 | Run Docker validation, sync `dist`, and built CLI smokes. | Done | `ev:T-0379:752358a1a77147e6a2d52a04`, `ev:T-0379:e80bf2ffaa394eb899ef88b3`, `ev:T-0379:fb174f9ca4254d2b9aa4bec9`. |
| 5 | Attach evidence, update shared state, finish/ready/close. | Done | Evidence and shared docs are prepared for finish/ready/close. |
