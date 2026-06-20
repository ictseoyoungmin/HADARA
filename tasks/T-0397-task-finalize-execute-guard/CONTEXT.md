# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Canonical lifecycle command loop and boundaries. | Read |
| docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md | T-0397 execute guard requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The reviewed dry-run plan hash is enough to guard this local serial wrapper. | T-0396 stable plan hash behavior and T-0397 focused tests. | A stale plan hash could execute unintended writes if not rechecked; T-0397 refuses mismatches before any writer call. |
| Existing finish and close writers should remain the only mutation paths. | HADARA lifecycle model. | Duplicating writes here would create proof drift and hidden write boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Execute must be serial and stop on first blocker. | T-0392 lifecycle spec. | T-0397 returns execution metadata and stopped step. |
| No shared-doc writes from finalize. | HADARA protocol. | Operators must finalize shared docs before running guarded execute. |
| `ok:true` only after final audit is `closed-valid`. | T-0392 lifecycle spec. | The execute report recomputes audit state after close evidence append. |
