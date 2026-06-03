# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| tasks/T-0228-tui-projection-first-operator-read-model/HANDOFF.md | Prior TUI projection-first read-model state. | Read |
| tasks/T-0229-tui-selected-task-detail-shared-read-model/HANDOFF.md | Selected task shared-detail state and slow `/mnt/f` smoke evidence. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Dashboard task projection and Task Board are acceptable operator task sources for TUI broad lists. | T-0228 direction and current dashboard projection architecture. | Deleted task directories may remain visible until source-of-truth docs/projections are repaired. |
| Snapshot smoke can use fast profile by default. | TUI snapshot is a read-only smoke render, not a full advisory report. | Operators expecting full debt/release/tool advisory in snapshot need interactive/full read paths later. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep TUI read-only. | Existing TUI contract. | No task repair writes or cache outside `.hadara/local/tui`. |
| Avoid Markdown semantic parsing inside TUI where shared services/projections exist. | T-0228 review direction. | TUI may parse Task Board only as bounded fallback/source merge through shared table helper. |
| Preserve private evidence cache disablement. | TUI cache security boundary. | Cache remains disabled when private evidence is requested. |
