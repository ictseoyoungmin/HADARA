# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current dashboard state and T-0225 completion baseline. | Read |
| docs/AGENT_HANDOFF.md | Latest completed task, known problems, and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and current capsule ordering. | Read |
| docs/IMPLEMENTATION_SOP.md | Docker validation and task workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit semantics for this capsule. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0225 successfully made task-signals cooperative but did not add per-stage duration history. | T-0225 handoff and source inspection. | If wrong, this task may duplicate existing metadata. |
| Measurement should be advisory until enough local filesystem observations exist. | User request. | Premature hard budgets could make validation flaky. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep core route independent from refresh completion. | User request and T-0225 acceptance. | Measurement must observe core during refresh, not force bypass or wait for completion. |
| Prefer Docker for Node/npm validation and built CLI refresh. | IMPLEMENTATION_SOP and AGENT_HANDOFF. | Host-local validation is not the project baseline. |
| Do not implement streaming directory scan in this capsule. | User sequencing feedback. | T-0228 remains the follow-up if measurement shows directory listing cost dominates. |
