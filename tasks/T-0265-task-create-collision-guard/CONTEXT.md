# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Phase 6.1 next work. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task create semantics and workflow boundaries. | Read |
| docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md | T-0265 scope and acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Bounded local retry is sufficient for Phase 6.1 compatibility hardening. | T-0265 out-of-scope excludes global allocator and assignment service. | Truly simultaneous filesystem writes may still need a later stronger allocator if observed. |
| Existing task ID format should remain sequential `T-0000`. | T-0265 out-of-scope excludes random ID migration. | Sequential IDs remain collision-prone, but retry covers normal local race windows. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve template behavior. | T-0259 and T-0265 scope. | Template files remain Draft-only and evidence-free at create time. |
| Preserve Task Board as the public task queue source. | HADARA protocol. | Task Board row collision must not silently create duplicate queue rows. |
| No durable global allocator. | T-0265 out of scope. | Keep implementation in task capsule creation helper. |
