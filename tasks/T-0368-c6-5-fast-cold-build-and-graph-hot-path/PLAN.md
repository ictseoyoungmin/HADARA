# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C6/C4 specs. | Complete | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, C6/C4 specs |
| 2 | Document capsule scope and fast-path decisions. | Complete | TASK/DECISIONS/RISKS/FILES |
| 3 | Implement git worktree source-manifest fingerprinting and cache read reuse. | Complete | `src/context/source-manifest.ts`, `src/context/context-cache-store.ts` |
| 4 | Route context graph cache orchestration through the fast manifest resolution. | Complete | `src/context/context-graph-builder.ts` |
| 5 | Add focused unit tests for fast hits and stale invalidation. | Complete | `tests/unit/context-source-manifest.test.ts`, `tests/unit/context-cache-store.test.ts` |
| 6 | Run Docker validation and record evidence. | Complete | `ev:T-0368:a2306de95f6b4741bf91c897` |
| 7 | Update handoff/state docs and close the capsule. | Complete | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md` |
