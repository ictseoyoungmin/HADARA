# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and completion evidence. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task workflow and dry-run/write boundary semantics. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Source design for protocol doctor/remediation and task upgrade surfaces. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Execute mode should prove dry-run review for planned remediation writes. | Handoff next step and Phase 2 dry-run-first posture. | If wrong, existing execute convenience might be more important than the stricter safety contract. |
| Existing per-action hashes should remain in place. | Current implementation and tests. | Removing them would lose apply-time conflict detection. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add new remediation fix types. | Task scope. | Safety contract only. |
| Preserve no-delete/no-broad-rewrite behavior. | Phase 2 spec. | Writes remain bounded and dry-run-first. |
| Prefer Docker validation for CLI changes. | IMPLEMENTATION_SOP and handoff. | Full sync-build refreshes `/workspace/dist`. |
