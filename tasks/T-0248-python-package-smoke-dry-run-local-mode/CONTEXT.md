# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Release/provider slice ordering and tracked state. | Read |
| docs/TEST_STRATEGY.md | Package-smoke validation and artifact boundaries. | Read |
| docs/SECURITY_MODEL.md | Secret/path/log boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0247 Python preview metadata is available. | Commit `d1a78c4`. | Python smoke could duplicate metadata detection if preview provider is ignored. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No PyPI token or publish behavior. | User scope and release security model. | Accidentally widening release mutation surface would violate roadmap boundaries. |
| Public output remains reduced. | TEST_STRATEGY and SECURITY_MODEL. | Raw logs/private paths must not enter committed evidence. |
