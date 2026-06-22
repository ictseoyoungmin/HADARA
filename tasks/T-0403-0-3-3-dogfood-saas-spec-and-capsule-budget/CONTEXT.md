# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and 0.3.3 rc publish state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended step. | Read |
| docs/TASK_BOARD.md | Task queue and T-0402/T-0403 status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and spec registration expectations. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle rules. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A product dogfood project should be separate from HADARA-dev. | Keeps release source repo clean and proves installed-package behavior. | If wrong, future dogfood may need a monorepo/fixture layout. |
| Fifteen capsules are enough for demo scope but not enough for production-oriented SaaS plus HADARA audit. | Product complexity and dogfood findings need separate hardening/audit capsules. | Under-budgeting would hide product or HADARA workflow defects. |
| First material family should be user-assisted grass/texture extraction, not universal asset decomposition. | Feasibility assessment. | Over-scoping would turn the line into an open-ended research project. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Default dogfood app must run with Docker Compose and no GPU. | User request and feasibility boundary. | Optional ML can be added later behind a profile. |
| Public evidence must not include raw uploaded images. | HADARA evidence/privacy model. | Use reduced reports and generated/synthetic fixtures. |
| Dogfood must use published `hadara@0.3.3-rc.0`. | Release validation goal. | Source checkout behavior alone is insufficient. |
