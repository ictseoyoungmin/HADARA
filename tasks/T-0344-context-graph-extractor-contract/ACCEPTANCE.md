# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Shared context graph extractor interface and extraction context are defined without source-specific extractor behavior. | Done | `src/context/extractor-contract.ts`; `ev:T-0344:567e18dd540c4ea085934770`. |
| AC-2 | Deterministic helpers exist for project-relative paths, source refs, source hashes, node ids, edge ids, empty results, merged results, and count summaries. | Done | `src/context/extractor-contract.ts`; `tests/unit/context-graph-extractor-contract.test.ts`. |
| AC-3 | Focused and full validation passed using the Docker baseline, and workspace `dist` was refreshed from Docker build output. | Done | `ev:T-0344:567e18dd540c4ea085934770`. |
| AC-4 | No CLI surface, cache write, source-specific extractor, code index, context pack, or state projection replacement was added. | Done | Diff scope and T-0344 out-of-scope notes. |
| AC-5 | Handoff identifies the next C1 capsule as Task Board + Task Capsule extractors. | Done | `HANDOFF.md`; `docs/AGENT_HANDOFF.md`; `docs/PROJECT_STATE.md`. |
