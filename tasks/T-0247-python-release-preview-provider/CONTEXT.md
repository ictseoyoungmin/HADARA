# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Release/provider slice ordering and tracked state. | Read |
| docs/TEST_STRATEGY.md | Validation and release/package smoke boundaries. | Read |
| docs/SECURITY_MODEL.md | Secret and execution boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0246 provider contract is the base for Python preview. | Commit `6f1bd1e`. | Parser metadata could be placed in an incompatible report shape if provider contract is ignored. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preview must remain read-only. | User request and security model. | No Python build, twine, pip, PyPI token, publish, artifact write, or evidence attachment from preview. |
