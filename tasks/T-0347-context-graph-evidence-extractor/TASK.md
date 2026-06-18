# T-0347 Context Graph Evidence Extractor

## Metadata

| Field | Value |
|---|---|
| ID | T-0347 |
| Title | Context Graph Evidence Extractor |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only context graph evidence extractor. | Emit Evidence nodes, task-evidence edges, close-proof edges, evidence dependency edges, and evidence state sources from Task Capsule `evidence.jsonl` files. |

## Scope

| In Scope | Reason |
|---|---|
| `extractEvidence()` source extractor. | Required C1 source-specific extractor after task/docs/command extraction. |
| Focused unit coverage. | Proves v2 durable ids, legacy compatibility ids, close-proof tags, dependency tags, state source counts, and malformed evidence degradation. |
| Capsule and shared state docs. | Keep HADARA close-source docs current before finish/close. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Public CLI/read surface integration. | Graph assembly and user-facing commands are planned later. |
| Evidence append or migration behavior. | Context graph extraction must remain read-only and non-authoritative. |
| Managed section, release readiness, handoff, decision, or known-problem extraction. | These are separate planned C1 source slices. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
