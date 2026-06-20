# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Canonical finish/ready/close/audit loop and write boundaries. | Read |
| docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md | Defines the lifecycle convenience line and finalize dry-run budget. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A single read-only finalize report is useful before a guarded execute mode exists. | T-0392 spec and dogfooding friction. | If wrong, the command remains additive and non-mutating. |
| Existing lifecycle reports are the source of truth. | HADARA workflow docs. | Reimplementing validation could drift from finish/ready/close/audit behavior. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not weaken canonical lifecycle proof commands. | HADARA protocol. | `task finalize` composes existing reports and does not write. |
| No hidden writes from read commands. | Lifecycle spec and context-routing cache principles. | `--execute` is explicitly refused in this capsule. |
| Dist must be refreshed after CLI source changes. | AGENTS.md / HADARA-dev workflow. | Docker sync-build was run and evidence attached. |
