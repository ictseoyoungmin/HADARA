# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| tasks/T-0230-tui-projection-first-task-index-cache-replacement/HANDOFF.md | Prior timing evidence and remaining bottleneck. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dynamic imports in `main.ts` are acceptable for CLI handlers. | `main()` is already async and some handlers are already awaited. | If an import path is wrong, command dispatch would fail; focused CLI tests cover representative commands. |
| TUI snapshot target is wall-clock built CLI time on `/mnt/f`. | User goal and T-0230 evidence. | Timing can vary by host, but 1.37s leaves margin under 2s. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve JSON error handling. | CLI contract. | `main(args).catch(...)` remains unchanged. |
| Do not change command output contracts. | CLI JSON contract. | Only import timing changed. |
