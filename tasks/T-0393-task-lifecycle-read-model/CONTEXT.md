# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Session read-routing and HADARA-dev boundaries. | Read |
| docs/PROJECT_STATE.md | Current project state and T-0392 lifecycle line. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next implementation capsule. | Read |
| docs/TASK_BOARD.md | Task queue and T-0393 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, validation, and documentation timing rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Canonical finish/ready/close/audit semantics and `task lifecycle` docs. | Read |
| docs/DEVELOPMENT_SLICES.md | Shared slice tracking for T-0393 completion. | Read |
| docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md | Source requirements for the lifecycle convenience line. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The first lifecycle convenience implementation should be read-only. | T-0392 spec. | Hidden writes would weaken the proof model. |
| Existing finish/ready/close/audit reports can be composed instead of duplicating validation logic. | Existing lifecycle services. | Duplicated logic could drift from canonical command behavior. |
| Stale/invalid close-repair fixture coverage belongs in T-0394. | T-0392 capsule budget. | Over-scoping T-0393 would delay the first usable read API. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve canonical lifecycle commands. | T-0392 spec and `docs/TASK_WORKFLOW_COMMANDS.md`. | `task lifecycle` reports next actions only. |
| Do not write from lifecycle reports. | T-0392 acceptance and command docs. | Tests assert no task-local writes for the service path. |
| Use Docker validation for HADARA-dev CLI changes. | `docs/AGENT_HANDOFF.md`. | Host Node/npm is not the baseline on this mounted workspace. |
