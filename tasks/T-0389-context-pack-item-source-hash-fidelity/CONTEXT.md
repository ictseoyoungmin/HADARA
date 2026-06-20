# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Session entry point and read routing. | Read via 0.3.3 session-start/context-pack flow |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known problems. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.3/context-routing/03_Context_Pack_and_Session_Start_Spec.md | Context pack item contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `context pack` can rank document nodes whose graph source is `.hadara/docs-registry.json`. | Dogfood output for T-0388. | Item `sourceHash` can point at registry text instead of item path text. |
| Reading bounded selected item files is acceptable in context pack. | The item set is budget-capped and raw-sliceable only. | If this assumption is wrong, context pack could add minor read overhead. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read commands must not write cache or project state. | AGENTS / context-routing specs. | This change reads bounded file content only and does not write cache. |
| Cache remains lower authority than source files. | Context-routing specs. | Current file text should win when available for raw-sliceable item hashes. |
