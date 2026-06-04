# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and evidence rules. | Read |
| docs/TEST_STRATEGY.md | Release/package-smoke evidence boundary. | Read |
| T-0249 capsule | Prior boundary hardening. | Read |
| User attached notes | Advisory model requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Python package-smoke evidence may exist but remains advisory. | User attached notes. | Could accidentally be modeled as a release blocker. |
| npm remains the active primary release target. | PROJECT_STATE and attached notes. | Python discovery could be over-promoted. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `blocking:false` for Python advisories. | User attached notes. | Release dry-run readiness must not depend on Python smoke. |
| No Python publish/PyPI behavior. | User attached notes. | Keep report read-only and token-free. |
