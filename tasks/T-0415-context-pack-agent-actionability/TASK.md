# T-0415 Context Pack Agent Actionability

## Metadata

| Field | Value |
|---|---|
| ID | T-0415 |
| Title | Context Pack Agent Actionability |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Improve context-pack actionability for agents | Add read-only prioritized action hints and clearer ranking reasons so agents can move from `context pack` output to bounded reads without re-deriving the next command. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.contextPack.v1` additive output | Add read-only `agentActions` with prioritized commands/args derived from existing ranked items, slice candidates, and validation suggestions. |
| Ranking/reason hardening | Prefer task-local context and source-specific nodes over broad docs where graph edges justify it; make `readFirst.reason` more concrete. |
| Contract docs/tests | Update schema, CLI JSON contract, schema registry docs, and focused tests. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Cache writes or warm behavior | Context pack must remain a read-only consumer. |
| Raw source text retrieval | `context slice` remains the raw text command; context pack only suggests bounded actions. |
| New retrieval backend or vector ranking | 0.3.4 is UX hardening, not a new context engine. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25 | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | In Progress | Scope narrowed to additive context-pack actionability and reason/ranking hardening. | TBD |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
