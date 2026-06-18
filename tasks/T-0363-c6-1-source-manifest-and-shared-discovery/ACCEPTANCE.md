# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.context.sourceManifest.v1` schema is registered in runtime and schema index fixtures. | Done | `src/core/schema.ts`, `src/schemas/schema-index.json`, `tests/unit/schema-fixtures.test.ts`. |
| AC-2 | Source manifest builder returns project-relative, metadata-first, budgeted source entries without content hashes by default. | Done | `tests/unit/context-source-manifest.test.ts`. |
| AC-3 | Previous content hashes can be carried forward only when metadata matches, and subset hashes are available for cache keys. | Done | `tests/unit/context-source-manifest.test.ts`. |
| AC-4 | Manifest comparison reports changed/added/removed paths and extractor-key invalidation hints. | Done | `tests/unit/context-source-manifest.test.ts`. |
| AC-5 | Validation records include the expected host dependency failure and Docker focused/full checks. | Done | `ev:T-0363:72c3bfa638d94ac6b200b3de`, `ev:T-0363:0fc9286c6a1e45b0ac9b6c53`, `ev:T-0363:d1b2b1425c9b4d939f001d1c`, `ev:T-0363:9c3d5872e2194d2196f18705`, `ev:T-0363:b845f1b45c524d66b79e5936`, `ev:T-0363:aec3cd54336c4e0eb3b95fc7`. |
| AC-6 | Shared state docs route the next slice to C6.2 cache store work, not stale C3 work. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md`. |
