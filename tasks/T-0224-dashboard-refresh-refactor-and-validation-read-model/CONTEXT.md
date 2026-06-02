# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase ordering and T-0223 completion context. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit loop. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0006 task-next recommendation is not the right active scope. | `task next` output and user request. | Could accidentally work on Hermes instead of dashboard hardening. |
| Dashboard validation fallback currently prefers old history when table rows are not parsed. | User screenshot and read-model inspection. | Home activity can show stale T-0096 validation. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep dashboard read-only. | Dashboard phase contracts. | No shell/provider/MCP/task/evidence mutation from browser. |
| Avoid repeated parser fixes. | User request. | Shared handoff parser replaces local ad-hoc table parsing. |
| Avoid unnecessary broad refresh scans. | T-0219/T-0223 carry-forward warning. | Manual refresh uses async/bounded projection stages. |
