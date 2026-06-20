# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current project state, handoff, task board, workflow docs, and lifecycle convenience spec. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |
| 2 | Implement `task finalize` as a read-only composition over finish, ready, close, and audit-close reports. | Done | `src/task/task-finalize.ts`, `src/cli/task.ts` |
| 3 | Register schema, command metadata, and documentation. | Done | `src/schemas/task-finalize.schema.json`, `src/core/schema.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |
| 4 | Validate focused behavior, full Docker sync-build, built CLI smokes, and diff cleanliness. | Done | `ev:T-0396:874095dd00434f5195eb144a`, `ev:T-0396:1057e733697c467aa0fbc9cd`, `ev:T-0396:d7b3975a5e4849f9ab74da22`, `ev:T-0396:7d3e8d90a33149be8a8e2e94`, `ev:T-0396:c1bb5501c5d8471f81406164` |
| 5 | Update capsule and shared handoff/state docs before finish/ready/close. | Done | This capsule, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` |
