# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | C1 context graph and task context TypeScript contracts are defined without adding extractor, CLI, or cache behavior. | Done | `src/context/context-graph.ts`; `ev:T-0343:52220ea996ec416ab6d508fc`. |
| AC-2 | `hadara.contextGraph.v1` and `hadara.taskContext.v1` schema fixtures are registered in the runtime loader and schema index. | Done | `src/core/schema.ts`; `src/schemas/schema-index.json`; `tests/unit/schema-fixtures.test.ts`. |
| AC-3 | Representative context graph and task context reports validate, and invalid missing-required data fails schema validation. | Done | `tests/unit/context-graph-schema.test.ts`; Docker focused tests passed. |
| AC-4 | Full repository validation, built CLI smoke, and diff hygiene are recorded. | Done | Docker `npm run check` passed; `node dist/cli/main.js version --json` passed; `git diff --check` passed. |
| AC-5 | Capsule and shared handoff/state docs identify the next C1 implementation capsule. | Done | `HANDOFF.md`; `docs/AGENT_HANDOFF.md`; `docs/PROJECT_STATE.md`. |
