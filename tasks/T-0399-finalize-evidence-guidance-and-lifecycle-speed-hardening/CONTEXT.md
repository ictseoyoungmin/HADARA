# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state routing and compact project anchor. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command boundaries and finalize semantics. | Read |
| docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md | Lifecycle convenience line constraints. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `task finalize` should stay additive over the existing lifecycle commands. | Lifecycle spec and prior T-0396/T-0397 implementation. | Replacing canonical commands would weaken HADARA's proof model. |
| The main speed win available in this capsule is avoiding unnecessary lifecycle report construction. | Dogfood observation and current `task-finalize.ts` structure. | A broader performance pass would exceed the small hardening scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only finalize dry-runs must not write evidence, close proof, Task Board, or capsule docs. | `docs/TASK_WORKFLOW_COMMANDS.md` | Only execute mode may orchestrate underlying writes after plan-hash review. |
| Close-source docs must be complete before final close execute. | `AGENTS.md`, `docs/IMPLEMENTATION_SOP.md` | Do not add volatile close evidence ids to close-source docs. |
| Validation should use Docker/built CLI baseline for HADARA-dev CLI changes. | `AGENTS.md`, `docs/AGENT_HANDOFF.md` | Host npm state is not authoritative. |
