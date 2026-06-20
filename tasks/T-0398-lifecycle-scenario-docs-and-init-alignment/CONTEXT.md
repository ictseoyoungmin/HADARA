# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and latest lifecycle line status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and generated-doc alignment target. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Canonical lifecycle command loop and proof boundaries. | Read |
| docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md | T-0392 through T-0398 lifecycle convenience budget and scenario. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The explicit lifecycle commands remain canonical even after adding `task finalize`. | T-0392 lifecycle convenience spec and T-0397 implementation. | Docs could imply the guarded convenience replaces proof boundaries. |
| Fresh init guidance is generated from `src/cli/init.ts`, not edited generated outputs. | Existing project structure. | Future projects would miss the new guidance if only root docs changed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not write. | HADARA protocol and T-0393/T-0394/T-0396 command design. | Documentation keeps lifecycle/repair/finalize dry-runs read-only. |
| Guarded execute requires reviewed `planHash`. | T-0397 implementation. | Examples include explicit `--plan-hash`. |
| Do not weaken close-source fixed point. | Task workflow docs. | Shared state and capsule docs are updated before close. |
