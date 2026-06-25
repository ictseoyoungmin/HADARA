# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0418 failure context. | Done | AGENTS.md, current-state docs, operator log |
| 2 | Route legacy dashboard `/api/debt` through the fast dashboard debt projection. | Done | `src/cli/dashboard.ts` |
| 3 | Update dashboard API route contract test. | Done | `tests/unit/dashboard-static.test.ts` |
| 4 | Run focused Docker build/dashboard validation and clean-checkout recheck. | Done | `ev:T-0421:98e0dd670b3c489484bdebfb`, `ev:T-0421:88bc742a31814e089efcdb66` |
| 5 | Update capsule docs, shared state, and release retry instructions. | Done | This capsule; shared docs |
