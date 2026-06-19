# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Source manifests persist a git worktree fast-freshness fingerprint. | Done | `src/context/source-manifest.ts`; fingerprint test covers fresh, mtime-only fresh, and content-change mismatch. |
| AC-2 | Cache status/warm reuses cached source manifests on fresh fingerprint hits and falls back conservatively. | Done | `src/context/context-cache-store.ts`; cache test covers fast hit and stale invalidation. |
| AC-3 | `context graph` uses the same cache manifest resolution instead of rebuilding the source manifest unconditionally. | Done | `src/context/context-graph-builder.ts`; graph cache metadata assertion in cache-store test. |
| AC-4 | Validation evidence and shared state docs are updated. | Done | `ev:T-0368:a2306de95f6b4741bf91c897`; `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`. |
