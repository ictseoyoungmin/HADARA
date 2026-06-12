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
| docs/DEVELOPMENT_SLICES.md | T-0305 planned slice and acceptance summary. | Read |
| docs/specs/0.3.0/rc2/HADARA_0.3.0-rc.2_Workflow_UX_Hardening_Plan.md | Source plan for T-0305. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Task Board canonical columns remain ID, Title, Status, Capsule, Notes. | T-0305 spec. | If historical boards use radically different columns, this capsule should not attempt broad schema migration. |
| Human-authored cells should preserve content semantics, not necessarily exact original padding. | Existing row formatter normalizes table spacing. | Low; acceptance focuses on cell survival and pipe handling. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task finish --execute` may only write `TASK.md` and `docs/TASK_BOARD.md`. | `docs/TASK_WORKFLOW_COMMANDS.md`. | Preserve bounded write boundary. |
| Escaped pipe coverage is required; inline-code pipe handling is best-effort. | T-0305 spec. | Keep parser local and small. |
