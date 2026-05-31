# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3 order. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Suggested action requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0171 workbench report is the consumer for this engine. | Previous capsule. | Low; integration test covers workbench. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Suggested actions must not execute commands. | Phase 3 safety posture. | Actions expose copyable commands only. |
| Execute-capable suggestions need dry-run pairing. | Phase 3 action model. | Builder emits `command` plus `executeCommand`. |
