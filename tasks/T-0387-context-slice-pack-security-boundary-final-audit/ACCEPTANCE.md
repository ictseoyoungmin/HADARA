# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Shared context-slice boundary helper is implemented and used by raw slice and context pack candidate generation. | Met | `ev:T-0387:561d66c217184e529964d5ee` |
| AC-2 | Context pack no longer publishes slice candidates for denied generated/local/private paths while preserving allowlisted public `.hadara` paths. | Met | `ev:T-0387:561d66c217184e529964d5ee` |
| AC-3 | Focused and full Docker validation evidence is attached, including the initial full-run timeout and passing retry. | Met | `ev:T-0387:2691a5ec97e045d2814f10f7`, `ev:T-0387:561d66c217184e529964d5ee` |
| AC-4 | Task/shared handoff and context-routing completion audit are updated before close. | Met | HANDOFF.md, docs/AGENT_HANDOFF.md, docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md |
