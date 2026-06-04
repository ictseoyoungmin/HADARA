# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and evidence rules. | Read |
| T-0249/T-0250 capsules | Boundary/advisory prerequisites. | Read |
| User attached notes | Target configuration preview requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| npm remains effective primary. | User attached notes. | Python preview could be over-promoted. |
| Python and Docker target roles should be explicit but non-executing. | User attached notes. | Release dry-run could imply unsupported publish paths. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Automatic promotion is forbidden. | User attached notes. | `pyproject.toml` detection alone must not alter primary target. |
| Read-only config preview. | HADARA release safety model. | Do not write `.hadara/release-targets.json` or execute publish. |
