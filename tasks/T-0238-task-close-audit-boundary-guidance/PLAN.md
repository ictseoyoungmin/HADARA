# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and existing close/audit implementation. | Done | docs/AGENT_HANDOFF.md, docs/PROJECT_STATE.md, docs/TASK_BOARD.md, docs/IMPLEMENTATION_SOP.md, docs/DEVELOPMENT_SLICES.md, docs/TASK_WORKFLOW_COMMANDS.md, Phase 3 spec, and `src/task/task-close.ts` reviewed. |
| 2 | Add machine-readable close/audit boundary guidance without expanding writes. | Done | `src/task/task-close.ts` adds `lifecycle` and `auditVerdict` metadata. |
| 3 | Add focused tests for dry-run, execute, and audit report guidance. | Done | Focused Docker suite passed 5 files / 19 tests. |
| 4 | Run focused and full Docker validation. | Done | Focused Docker suite passed 5 files / 19 tests; Docker sync-build passed 92 files / 607 tests. |
| 5 | Attach evidence, finish, close, audit, and update handoff. | Done | Evidence attached; finish/ready/close/audit passed with closed-valid audit verdict. |
