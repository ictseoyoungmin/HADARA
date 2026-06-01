# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TEST_STRATEGY.md | Evidence semantic validation expectations. | Read |
| docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md | Dashboard/TUI selected-task read contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0192 is a post-Phase-4 hardening capsule requested before Dashboard implementation. | Operator request. | Low; scope is bounded to semantic read surfaces and docs. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not implement the v2 writer or migration command. | T-0190 plan. | This capsule only documents writer-facing metadata and hardens v1 read behavior. |
| Do not implement Dashboard UI. | Operator scope. | Update read contracts only. |
