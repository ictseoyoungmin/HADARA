# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Phase 8.2 spec. | Done | AGENTS/current-state docs, task workflow docs, T-0319 policy, and rc1 Phase 8.2 spec read. |
| 2 | Update task handoff scaffold and done-level validation. | Done | `src/task/task-capsule.ts`, `src/harness/validate.ts`, focused tests updated. |
| 3 | Run focused validation. | Done | `command:T-0320:docker-focused`, `command:T-0320:docker-full-sync-build`, `command:T-0320:repo-docs-harness-checks`. |
| 4 | Attach evidence and finish lifecycle. | Done | Validation evidence attached; `task finish --execute` synchronized `TASK.md` and Task Board. |
| 5 | Update shared handoff/state for Phase 8.3. | Done | `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/PROJECT_STATE.md` now route to Phase 8.3. |
