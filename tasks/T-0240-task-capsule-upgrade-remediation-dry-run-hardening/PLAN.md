# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 2 protocol consistency guidance. | Done | PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, IMPLEMENTATION_SOP, DEVELOPMENT_SLICES, TASK_WORKFLOW_COMMANDS, and Phase 2 spec reviewed. |
| 2 | Inspect existing task upgrade scaffold and protocol remediation implementations/tests. | Done | `src/task/task-upgrade-scaffold.ts`, `src/services/protocol-remediation.ts`, CLI handlers, schemas, and focused tests reviewed. |
| 3 | Implement before-hash dry-run/execute guards. | Done | `task upgrade-scaffold` and `protocol remediate` now expose `summary.beforeHash` and require matching execute hashes for planned writes. |
| 4 | Run focused and Docker validation. | Done | Focused suite passed 5 files / 36 tests; Docker sync-build passed 92 files / 610 tests; built CLI guard smoke passed. |
| 5 | Attach evidence, update docs/handoff, finish, close, and audit. | Done | Evidence and state docs are current; final finish/close/audit command loop is next. |
