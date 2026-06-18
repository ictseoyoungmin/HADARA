# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow. | Read |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | Active C2 symbol extraction requirements. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C2 capsule sequence. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Symbol extraction should consume exported declarations from T-0354 and stay additive. | Worker plan separates command hints/test relations/graph integration. | Avoid broad semantic parser work in this capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No proof claim based on code links. | C2 spec non-goal. | Symbol edges are context-routing hints only. |
| Source-addressed output is required. | Architecture overview. | Symbol and edge source metadata includes path/line/extractor/hash. |
