# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state docs, task workflow docs, and active C1/C2 context-routing specs. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, and context-routing specs read. |
| 2 | Inspect C1 graph builder/types/CLI and C2 code index APIs. | Done | Reviewed `src/context/context-graph.ts`, `src/context/context-graph-builder.ts`, `src/context/code-index.ts`, `src/cli/context.ts`, and existing tests. |
| 3 | Implement additive code-aware graph projection and `--include-code` CLI option. | Done | Added `src/context/code-graph-extractor.ts`, extended graph/schema vocabularies, and passed `includeCode` from CLI/builder. |
| 4 | Add focused tests for default compatibility, code nodes/edges, and task-scoped CLI output. | Done | Added builder/CLI/registry coverage; focused Docker test passed 4 files / 23 tests. |
| 5 | Run focused/full Docker validation, refresh `dist`, and run built smokes. | Done | Focused tests passed 4 files / 24 tests; Docker build passed; Docker `npm run check` passed 130 files / 835 tests; built version and `context graph --include-code` smokes passed; `git diff --check` passed. |
| 6 | Attach evidence and update capsule/shared docs before finish/ready/close. | Done | Final evidence `ev:T-0358:407b29c183f246d390f162f9` appended; shared docs updated. |
