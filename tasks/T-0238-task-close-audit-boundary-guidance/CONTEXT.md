# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and next lifecycle-hardening direction. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, known close fixed-point issue, and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and newly created T-0238 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, Docker validation baseline, evidence and close/audit command loop. | Read |
| docs/DEVELOPMENT_SLICES.md | Roadmap ordering and prior close/audit slices. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard task loop and command write boundaries. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Close lifecycle model and Phase 3 close/audit semantics. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Additive report metadata is enough for this capsule. | Existing schemas allow additional properties and consumers should preserve compatibility. | If a consumer requires strict fields, schema fixtures may need follow-up. |
| Close/audit code can stay in `src/task/task-close.ts`. | Current implementation already owns both close and audit reports. | Splitting files here would be unrelated refactor churn. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task close --execute` writes only close evidence. | docs/IMPLEMENTATION_SOP.md and docs/TASK_WORKFLOW_COMMANDS.md | Do not add Task Board, Project State, or handoff writes. |
| `task audit-close` is read-only. | docs/IMPLEMENTATION_SOP.md and Phase 3 spec | Audit should inspect close evidence after close. |
| Avoid dashboard/TUI polishing. | docs/AGENT_HANDOFF.md | UI work is paused unless an operator blocker appears. |
