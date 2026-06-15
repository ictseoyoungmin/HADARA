# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 8.1 specs. | Done | AGENTS, current-state docs, task workflow docs, SOP, and rc1 specs read. |
| 2 | Update workflow/status governance docs and generated guidance. | Done | `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/IMPLEMENTATION_SOP.md`, `src/cli/init.ts`, and focused init tests updated. |
| 3 | Run docs/template-focused validation. | Done | `git diff --check`, focused Docker init tests, docs doctor/required-reading, built CLI smoke, and draft harness validation passed; full Docker timeout recorded. |
| 4 | Attach evidence and finish task lifecycle. | Done | Evidence attached; `task finish --execute`, `task ready`, `task close --execute`, and `task audit-close` completed with close audit returning `closed-valid`. |
| 5 | Update shared state and handoff for the next capsule. | Done | `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and Task Capsule handoff updated. |
