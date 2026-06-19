# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C4/C6 specs. | Complete | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, C4/C6 specs |
| 2 | Document C4 core scope and constraints. | Complete | TASK/CONTEXT/ACCEPTANCE/FILES |
| 3 | Implement context slice types, schema, and service. | Complete | `src/context/context-slice.ts`, `src/schemas/context-slice.schema.json`, `src/core/schema.ts` |
| 4 | Add read-only `context slice` CLI and registry metadata. | Complete | `src/cli/context.ts`, `src/services/capability-registry.ts` |
| 5 | Add focused unit/CLI tests for range, tail, keyword, managed section, and safety failures. | Complete | `tests/unit/context-slice.test.ts`, `tests/unit/context-graph-cli.test.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts` |
| 6 | Run Docker validation and record evidence. | Complete | `ev:T-0369:905e29de909447c792f65df0`, `ev:T-0369:0d173cea1f054b8680afe2b5`, `ev:T-0369:fc46ecd5d91943e986e1af23` |
| 7 | Update shared docs and close the capsule. | Complete | Shared docs updated; finish/ready/close lifecycle in progress from built CLI |
