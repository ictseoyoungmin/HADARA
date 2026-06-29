# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact project-local context anchor and read-routing guide. | Read |
| `docs/PROJECT_STATE.md` | Current project state and pending 0.4 registration boundary. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff, latest T-0424 state, and next task boundary. | Read |
| `docs/TASK_BOARD.md` | Task queue and capsule paths. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules and documentation timing baseline. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Current lifecycle command order and semantics. | Read |
| `docs/specs/0.4.0/productization-redesign/` | Target spec/template package for this clarification. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The root `AGENTS.md` structure is a good source for top-level reading/rule guidance, but HADARA-dev-specific rows must not become generic 0.4 scaffold defaults. | Operator feedback and T-0424 product-default boundary. | Generated projects could inherit overly broad HADARA-dev instructions. |
| `HADARA_WORKFLOW.md` should own command order, lifecycle meaning, and Task Capsule document timing. | Operator feedback. | Agents may keep asking whether command recipes belong in `AGENTS.md`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not register 0.4 specs as Required Reading in this capsule. | Operator deferred registration to T-04A1. | T-0425 is spec/template-only. |
| Do not edit closed T-0424 capsule docs. | HADARA close-source discipline. | Use T-0425 capsule for follow-up work. |
| Keep product defaults generic. | T-0424 decision boundary. | No HADARA-dev-only Docker/npm/release details in 0.4 templates. |
