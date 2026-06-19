# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Default `session start --task` consumes proven-fresh graph-core cache read-only and returns graph-backed context instead of the degraded no-live envelope. | Met | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
| AC-2 | If warm freshness cannot be proven, default Session Start keeps the bounded no-live fallback and does not scan live. | Met | `ev:T-0379:752358a1a77147e6a2d52a04` |
| AC-3 | Include-code Session Start can consume fresh code-index cache read-only when present, and missing/stale code cache degrades explicitly. | Met | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
| AC-4 | Focused tests, Docker validation, built CLI smokes, evidence, and handoff/state docs are complete. | Met | `ev:T-0379:752358a1a77147e6a2d52a04`, `ev:T-0379:e80bf2ffaa394eb899ef88b3`, `ev:T-0379:fb174f9ca4254d2b9aa4bec9`, `ev:T-0379:ef7d014317e24701bd2b61a8` |
