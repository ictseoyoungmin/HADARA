# T-0390 Context Pack Slice Candidate Range Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0390 |
| Title | Context Pack Slice Candidate Range Hardening |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Make context-pack raw slice candidates useful when only a single graph source line is known. | `context slice --task --candidate` should return a bounded source window instead of one-line heading-only slices when the pack item has no real end-line metadata. |

## Scope

| In Scope | Reason |
|---|---|
| `src/context/context-pack.ts` slice candidate range selection. | Fixes the dogfooded C3 -> C4 path without changing context graph ranking or raw slice resolution. |
| `tests/unit/context-pack.test.ts` candidate expectations. | Locks the bounded-window behavior and structured command args. |
| Context-routing contracts and task state docs. | Keeps the implemented behavior documented and close-ready. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New context slice strategies or resolver behavior. | The resolver already executes candidate strategies; the defect is candidate range generation. |
| Broad context pack ranking changes. | Ranking was not the source of the one-line slice output. |
| Cache or performance architecture changes. | This is a bounded hardening follow-up, not a C6 redesign. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | `task create` |
| 2026-06-20 | In Progress | Dogfooded `context pack` to `context slice --task --candidate` and found single-line explicit-range candidates. | `ev:T-0390:d6ab0cb842d3479faf06b351` |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
