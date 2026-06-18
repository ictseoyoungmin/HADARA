# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.codeIndex.v1` TypeScript contract and JSON schema fixture are present. | Done | `src/context/code-index.ts`; `src/schemas/code-index.schema.json`. |
| AC-2 | Schema index/runtime loading and fixture tests include `hadara.codeIndex.v1`. | Done | `src/schemas/schema-index.json`; `src/core/schema.ts`; focused tests passed. |
| AC-3 | Ignore rules exclude dependency/build/cache/local paths listed in the C2 spec. | Done | `CODE_INDEX_IGNORED_PATHS`; `tests/unit/code-index.test.ts`. |
| AC-4 | File discovery/classification identifies source, test, fixture, script, and config files without reading ignored paths. | Done | `discoverCodeIndexFiles()` and focused temp-project test. |
| AC-5 | No public CLI, cache writes, graph integration, source mutation, import/export extraction, symbol extraction, command hints, or test relation heuristics are added in this capsule. | Done | Public command registry unchanged; cache metadata is `{ used:false, hit:false }`; no graph integration added. |
| AC-6 | Focused and full Docker validation evidence is attached. | Done | `ev:T-0353:b72d5284ef1d42afa39232a0`. |
| AC-7 | Shared state docs and handoff point to the next C2 capsule. | Done | `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/AGENT_HANDOFF.md` updated before close. |
