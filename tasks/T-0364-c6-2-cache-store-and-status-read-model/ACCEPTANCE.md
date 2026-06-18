# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Internal cache store helper can read missing/corrupt/valid cache JSON and write atomically under `.hadara/local/cache/context`. | Met | `tests/unit/context-cache-store.test.ts`; `ev:T-0364:e80f8a290ea74e8c97ff34c1`. |
| AC-2 | `context cache status --json` reports cache miss/hit/stale/corrupt status from source manifest comparison without writing cache files. | Met | Store and CLI tests; built smoke `ev:T-0364:1e4fa5a72fbe4ad08d016cf6`. |
| AC-3 | Cache status and cache record schemas are registered in runtime and schema index. | Met | `src/core/schema.ts`, `src/schemas/schema-index.json`, schema focused tests. |
| AC-4 | Focused tests cover store, status CLI, stale extractor keys, corrupt cache, and no-write status behavior. | Met | `ev:T-0364:e80f8a290ea74e8c97ff34c1`. |
| AC-5 | Evidence is attached and shared docs route next work to cache warm/integration before C4. | Met | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`; validation evidence rows appended. |
