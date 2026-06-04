# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Release/provider slice ordering and tracked state. | Read |
| docs/ARCHITECTURE.md | Provider adapter boundary. | Read |
| docs/TEST_STRATEGY.md | Docker validation and release/package smoke boundaries. | Read |
| docs/SECURITY_MODEL.md | Secret and execution boundaries. | Read |
| docs/ROADMAP.md | Release/provider roadmap context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing npm release dry-run behavior must remain compatible. | T-0244/T-0245 handoff and tests. | Release readiness could regress if compatibility fields change. |
| Python provider starts as preview/detect-only. | User request for T-0246/T-0247 sequencing. | Premature Python execution or PyPI credential handling would violate scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Release dry-run remains read-only. | PROJECT_STATE and TEST_STRATEGY. | No publish, GitHub Release, Docker build, PyPI, token loading, or package execution. |
| Use Docker workflow for final validation when possible. | IMPLEMENTATION_SOP and TEST_STRATEGY. | Host checks are useful but not the historical validation baseline. |
