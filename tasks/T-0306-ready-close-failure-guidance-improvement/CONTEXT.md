# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact local context and routing guide. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close boundaries and docs timing. | Read |
| docs/DEVELOPMENT_SLICES.md | T-0306 planned slice and acceptance summary. | Read |
| docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md | Source plan for T-0306. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Additive issue fields are safe for existing JSON consumers. | Existing schemas use `additionalProperties: true`. | If a consumer rejects unknown issue fields outside schema validation, that consumer is already stricter than the contract. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not rename existing issue codes. | T-0306 spec. | Preserve current code strings. |
| `proof explain` parity is out of scope. | T-0306 spec. | Do not touch proof surfaces unless incidental compatibility requires it. |
