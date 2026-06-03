# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit self-hardening loop. | Read |
| docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md | Persisted v2 writer and migration boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| New writes can move to v2 before historical migration if readers accept mixed records. | Evidence v2 plan and user scope. | Task lifecycle commands could fail on mixed records; mitigated by read/lint/harness hardening. |
| The canonical writer is the right first target. | Evidence add-command, collect, attach, and close all route through shared writer behavior. | Custom release/smoke helpers may still need a later compatibility pass. |
| Human `EVIDENCE.md` should not be redesigned in this MVP. | User requested only the first evidence-v2 capsule. | Operators will not see persisted ids directly in Markdown until a later frame update. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep Dashboard/TUI UI paused. | Current project handoff. | No UI rendering changes in this capsule. |
| No mass migration. | Evidence v2 plan. | Existing v1 evidence remains valid and unchanged. |
| Use Docker validation as baseline. | Implementation SOP and handoff. | Host `node_modules` is disposable; Docker sync-build refreshes `dist`. |
