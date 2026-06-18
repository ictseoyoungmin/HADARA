# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `extractDocsRegistry()` emits Document nodes, supersession edges, and a docs-registry StateSource from `.hadara/docs-registry.json`. | Done | `src/context/registry-extractors.ts`; `tests/unit/context-graph-registry-extractors.test.ts`; `ev:T-0346:013ad0cd2fd843ccb006d900`. |
| AC-2 | Missing or invalid docs registry input degrades with explicit context graph issues instead of throwing. | Done | Missing-registry regression in `tests/unit/context-graph-registry-extractors.test.ts`; `ev:T-0346:013ad0cd2fd843ccb006d900`. |
| AC-3 | `extractCommandRegistry()` emits Command nodes and `DESCRIBES_COMMAND` edges from command metadata docs. | Done | Command registry regression covers `command:help` and `doc:docs/COMMAND_SURFACE.md -> command:help`; `ev:T-0346:013ad0cd2fd843ccb006d900`. |
| AC-4 | Scope remains read-only extractor work: no public CLI surface, graph builder, or state projection compatibility layer added. | Done | Source diff is limited to registry extractors, tests, capsule docs, and shared state docs. |
| AC-5 | Focused/full validation passed and evidence is attached. | Done | Docker focused tests passed 4 files / 14 tests; Docker `npm run check` passed 123 files / 805 tests; `ev:T-0346:013ad0cd2fd843ccb006d900`. |
