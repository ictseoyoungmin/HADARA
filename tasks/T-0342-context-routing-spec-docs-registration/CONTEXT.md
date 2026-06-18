# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle command semantics. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context-routing architecture overview. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker routing plan containing stale path. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Documentation registration is sufficient; runtime implementation should wait for separate C1/C2 capsules. | User request and context-routing specs. | Over-scoping would mix planning registration with runtime behavior. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context-routing commands must remain read-only when later implemented. | Context-routing architecture specs. | This task does not add commands. |
| Docs registry projections should stay aligned with SOP routing when new project-specific specs are relied on. | `docs/IMPLEMENTATION_SOP.md` project-specific docs guidance. | Update both human and machine-readable registry surfaces. |
