# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and latest completed task. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known lifecycle guidance issues. | Read |
| docs/TASK_BOARD.md | Task queue and T-0392 row. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Canonical finish/ready/close/audit semantics. | Read |
| docs/IMPLEMENTATION_SOP.md | Required-reading and doc-registration rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Shared slice tracking. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The canonical lifecycle commands should remain separate. | User discussion and `docs/TASK_WORKFLOW_COMMANDS.md`. | Removing commands would weaken proof boundaries. |
| Convenience belongs in additive read models and guarded orchestration. | T-0254/T-0255 existing actor/complete-flow history. | Hidden writes could create evidence or close-source drift. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| New spec must be conditionally routed, not default session reading. | Required Reading tiers. | Registered as reference/only-when-linked. |
| Follow-up command execution must remain dry-run-first. | HADARA workflow rules. | Captured in spec non-goals and proposed surfaces. |
