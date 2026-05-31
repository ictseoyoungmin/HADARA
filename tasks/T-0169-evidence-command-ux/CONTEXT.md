# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Defines evidence command UX split. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Agents need an easy alternative to hand-editing JSONL. | T-0164 evidence kind incident. | A command-log shortcut reduces mistakes. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `add-command` must not execute shell commands. | Reviewer guidance. | Only writes supplied summary/result through canonical evidence writer. |
