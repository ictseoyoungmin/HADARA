# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and lifecycle-hardening direction. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended task. | Read |
| docs/TASK_BOARD.md | Task queue and T-0237 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation baseline. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice completion state. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit write-boundary semantics. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON report contract. | Read |
| src/task/task-finish.ts | Existing finish implementation and advisory boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Finish broad-doc updates should remain advisory-only. | TASK_WORKFLOW_COMMANDS and AGENT_HANDOFF. | Auto-writing prose docs would expand the write boundary too much. |
| Task-id mention is a useful freshness hint, not a semantic proof. | Existing protocol consistency checks use task id signals. | A doc can mention the task but still need human editing. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve `task finish --execute` bounded writes. | TASK_WORKFLOW_COMMANDS. | Only `TASK.md` and `docs/TASK_BOARD.md` may be written. |
| Docker validation is the repo baseline. | IMPLEMENTATION_SOP. | Host npm state is not authoritative. |
| Dashboard/TUI work remains paused. | AGENT_HANDOFF. | No UI changes in this capsule. |
