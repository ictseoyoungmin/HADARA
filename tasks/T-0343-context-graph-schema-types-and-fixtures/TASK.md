# T-0343 Context Graph Schema Types and Fixtures

## Metadata

| Field | Value |
|---|---|
| ID | T-0343 |
| Title | Context Graph Schema Types and Fixtures |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Define and register the C1 context graph and task context report contracts. | This is the first C1 foundation capsule before extractors or CLI surfaces. |

## Scope

| In Scope | Reason |
|---|---|
| Add TypeScript contract types for context graph nodes, edges, extraction results, task context, and cache metadata placeholders. | Establishes the interfaces later C1 extractors/builders must implement. |
| Add JSON Schema fixtures for `hadara.contextGraph.v1` and `hadara.taskContext.v1`. | Makes the C1 public read-model contracts visible to schema tooling. |
| Register the new schema fixtures in schema index/runtime loader/tests. | Keeps fixture registry and runtime validation aligned. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement extractors, graph builder, ranking logic, or CLI commands. | Deferred to later C1 capsules after contracts are stable. |
| Replace the existing Phase 8 `hadara.stateProjection.v1` service. | State projection implementation and compatibility alignment belongs in the later C1 state projection capsule. |
| Add C2 code index or source symbol extraction. | C2 starts after C1 foundation work. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started C1 schema/types/fixtures capsule. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
