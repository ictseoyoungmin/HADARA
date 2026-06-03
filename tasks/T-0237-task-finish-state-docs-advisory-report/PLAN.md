# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and task workflow sources. | Done | `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/PROJECT_STATE.md`, `src/task/task-finish.ts`. |
| 2 | Add structured `stateDocs` advisories to `task finish`. | Done | `src/task/task-finish.ts`. |
| 3 | Add focused tests for missing/current/pending state docs and unchanged write boundary. | Done | `tests/unit/task-finish.test.ts`. |
| 4 | Run focused and full validation. | Done | Focused 5 files / 40 tests; Docker sync-build 92 files / 607 tests. |
| 5 | Attach evidence and close the capsule. | Done | Evidence attached; ready/finish/close/audit-close passed. |
| 6 | Update project handoff/state docs. | Done | Project State, Agent Handoff, Development Slices, and Task Board updated. |
