# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | Workstream D target. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command semantics. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Warning-only close audit drift should still be actionable in finalize/lifecycle UX. | Direct code inspection and 0.3.4 spec. | If wrong, close-source edits after close can appear complete to agents. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not weaken close proof. | 0.3.4 spec. | Drift remains repair-required; `task close-repair-plan` stays read-only diagnosis. |
| Keep schema shape additive. | CLI JSON contract. | Reused existing issue fixHint/example and nextAction fields. |
