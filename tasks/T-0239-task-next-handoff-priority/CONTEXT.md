# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and next core lifecycle direction. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended step. | Read |
| docs/TASK_BOARD.md | Shows old Partial fallback row and current completed T-0238. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Required Reading registry. | Read |
| docs/DEVELOPMENT_SLICES.md | Roadmap slice history and no open current planned row. | Read |
| docs/specs/HADARA_Task_Next_Handoff_Priority_Refactor.md | New local source design for this capsule. | Written |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Handoff can name a current work direction without a concrete Task ID. | Current handoff says task capsule upgrade/remediation dry-run hardening, not a created T-XXXX. | If consumers require taskId, use a placeholder and createCommand guidance. |
| Old Partial rows should remain visible but non-primary. | T-0006 is legitimate historical backlog. | If hidden entirely, operators lose backlog visibility. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task next` remains read-only. | TASK_WORKFLOW_COMMANDS and new spec. | No task creation or doc mutation. |
| Additive JSON only. | Schema layer is fixture-level and compatibility-preserving. | Do not remove existing fields. |
| Dashboard/TUI work remains paused. | AGENT_HANDOFF. | Do not alter UI consumers in this capsule. |
