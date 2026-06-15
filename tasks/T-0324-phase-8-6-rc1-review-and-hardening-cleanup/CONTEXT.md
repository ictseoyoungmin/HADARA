# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing anchor. | Done |
| `docs/PROJECT_STATE.md` | Current project state and Phase 8 line. | Done |
| `docs/AGENT_HANDOFF.md` | Current handoff, Phase 8 known problems, and validation baseline. | Done |
| `docs/TASK_BOARD.md` | Task queue and T-0324 row. | Done |
| `docs/IMPLEMENTATION_SOP.md` | Workflow, validation, and status-token rules. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Finish/ready/close/audit and TaskStatus/CloseState semantics. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Phase 8 slice row and completion state. | Done |
| `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md` | rc1 implementation sequence and expected hardening review boundary. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A task-like directory without `TASK.md` is not a real Task Capsule source. | Task Capsule scaffold contract and T-0324 review of empty `tasks/T-0073-*` directory. | State projection might hide a malformed capsule if operators intentionally store partial task dirs without `TASK.md`. |
| `nextTaskId` should still consider task-like directories for collision avoidance. | Existing task create collision guard behavior. | Ignoring local dirs during ID allocation could cause create attempts to collide with operator-local leftovers. |
| Release readiness and rc1 publishing require a later capsule. | User requested hardening cleanup near the end of rc1 implementation, not publish mutation. | Version/package state would be overstated if this capsule claims release readiness. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | AGENTS.md / SOP. | Evidence was recorded through `evidence add-command`. |
| Prefer Docker validation for HADARA-dev source changes. | AGENTS.md. | Host focused Vitest was unavailable; Docker focused and full validation passed. |
| Keep TaskStatus and CloseState separate. | T-0319/T-0320 governance. | T-0324 uses persistent `Done` and leaves close proof to lifecycle close/audit. |
