# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/tui/HADARA_TUI_Shared_Operator_Read_Model_Spec.md | TUI read-model and projection-first constraints. | Referenced from SOP; no behavior conflict. |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Table-first Task Capsule docs should remain valid source text. | Current scaffold and screenshot. | Preview logic must adapt rather than changing documents back to prose. |
| Overview preview should show concise data values, not full table rendering. | TUI Overview card constraints. | Multi-cell table rows may need summarization rather than full table display. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep TUI read-only. | Existing TUI contract. | No project state writes outside task/docs updates for this capsule. |
| Preserve document viewer table rendering. | Existing TUI Markdown renderer tests. | Only preview extraction changes; full document renderer still renders tables. |
