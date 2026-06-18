# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow. | Read |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | Active C2 import/export extraction requirements. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C2 capsule sequence. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Import/export extraction should not create Symbol nodes yet. | Worker plan separates import/export extraction from symbol extraction. | Later symbol capsule must convert exported names into `CodeSymbolNode` records additively. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Unresolved imports degrade with warnings. | Code Link Layer spec. | Do not fail `CodeIndexReport.ok` for unresolved relative imports. |
| Keep output source-addressed. | Architecture overview. | `IMPORTS` edges include path, line, extractor, and hash when available. |
