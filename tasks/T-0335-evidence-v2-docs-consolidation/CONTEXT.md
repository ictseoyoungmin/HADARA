# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Current-state routing guide. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task/evidence command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.2 slice order. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 worker routing. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Evidence v2 release design context. | Read |
| docs/specs/0.3.2/capsules/T-0335_Evidence_v2_Docs_Consolidation.md | T-0335 acceptance and constraints. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0335 should consolidate, not expand, Evidence v2 behavior. | Capsule spec | Adding runtime behavior would exceed scope. |
| Release readiness prep remains T-0336. | Development Slices | Version bump/artifact validation should not happen here. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add rebuild/check-id/subject commands. | T-0335 scope | Deferred-scope docs only. |
| Keep generated init docs aligned with root docs. | T-0335 scope | Source-string changes require build/test validation. |
