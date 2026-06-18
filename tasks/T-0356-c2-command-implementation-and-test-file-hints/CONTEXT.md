# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close command lifecycle. | Read |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | Active C2 spec. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker capsule routing. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Command hints should remain routing projections, not proof. | C2 non-goals. | Agents could over-trust heuristic links. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep context commands read-only. | Worker plan. | No public command or cache write in this capsule. |
| Test relation heuristics are next scope. | Worker plan C2 step order. | Only registry-provided test-file hints should be emitted now. |
