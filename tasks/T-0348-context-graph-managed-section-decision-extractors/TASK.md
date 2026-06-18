# T-0348 Context Graph Managed Section Decision Extractors

## Metadata

| Field | Value |
|---|---|
| ID | T-0348 |
| Title | Context Graph Managed Section Decision Extractors |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add read-only managed-section, decision, and known-problem context graph extractors. | Emit ManagedSection, Decision, and KnownProblem nodes plus document/task relationship edges from existing docs and Task Capsule files. |

## Scope

| In Scope | Reason |
|---|---|
| `extractManagedSections()` source extractor. | Required C1 source extractor for managed document sections. |
| `extractDecisions()` source extractor. | Required C1 source extractor for project/task decision records. |
| `extractAgentHandoff()` known-problem extraction. | Agent handoff is the current known-problem source in the C1 graph plan. |
| Focused unit coverage. | Proves node ids, document/task relationship edges, and missing/parse degradation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Public CLI/read surface integration. | Graph assembly and user-facing commands are planned later. |
| Release readiness extraction. | Separate planned C1 source slice. |
| State projection compatibility alignment. | Dedicated later capsule after graph source extraction. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
