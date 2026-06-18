# T-0344 Context Graph Extractor Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0344 |
| Title | Context Graph Extractor Contract |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Define the shared C1 context graph extractor contract and deterministic helper APIs. | This prepares the next extractor capsules without implementing source-specific extraction yet. |

## Scope

| In Scope | Reason |
|---|---|
| Add a synchronous extractor interface and extraction context for read-only project projections. | Required before Task Board, docs registry, evidence, and release extractors can share behavior. |
| Add deterministic ID/source-hash/edge helper functions. | Enforces the C1 ID and source-addressability rules before source-specific extraction. |
| Add focused tests for helper determinism, path normalization, aggregation, and count summaries. | Keeps the contract executable without adding CLI surfaces. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement Task Board, Task Capsule, docs registry, evidence, command registry, managed section, release readiness, or handoff extractors. | These are separate C1 capsules after the shared contract. |
| Add public CLI/read surfaces. | CLI integration is later after graph builder and task context report exist. |
| Replace the existing state projection service. | State projection compatibility remains a dedicated C1 capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started shared extractor contract capsule. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
