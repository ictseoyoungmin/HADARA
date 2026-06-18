# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and 0.3.3 context-routing sequence. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known-problem source. | Read |
| docs/TASK_BOARD.md | Task queue and capsule paths. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | Defines ManagedSection, Decision, KnownProblem nodes and required extractors. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker order lists managed section, decision, and known-problem extraction after evidence extraction. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Managed sections should reuse the existing parser instead of re-parsing marker JSON ad hoc. | `src/services/managed-sections.ts`. | Parser issue codes must be mapped into context graph issue codes. |
| Project decisions are legacy heading-style while Task Capsule decisions are table-style. | `docs/DECISIONS.md` and Task Capsule templates. | Extractor should support both forms to avoid losing project decisions. |
| Current known problems live in `docs/AGENT_HANDOFF.md`. | Handoff current-state docs. | Task-local carry-forward warnings can remain future scope unless needed by graph assembly. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Extraction is read-only. | Context-routing architecture and C1 scope. | Do not patch managed sections or decision docs. |
| Keep release readiness, graph assembly, and public CLI integration out of this capsule. | Worker implementation order. | Add only source extractors and focused tests. |
