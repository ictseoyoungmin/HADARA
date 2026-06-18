# T-0346 Context Graph Registry Extractors

## Metadata

| Field | Value |
|---|---|
| ID | T-0346 |
| Title | Context Graph Registry Extractors |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Implement C1 docs registry and command registry extractors. | Adds Document and Command node extraction after task extractors and before evidence/managed-section extraction. |

## Scope

| In Scope | Reason |
|---|---|
| Add `extractDocsRegistry()` for Document nodes, supersession edges, and docs-registry state. | Covers `.hadara/docs-registry.json` as a C1 input source. |
| Add `extractCommandRegistry()` for Command nodes and document-to-command edges. | Covers the authoritative command registry without adding public context commands. |
| Add focused tests for registry extraction and missing docs-registry degradation. | Verifies source-specific extraction behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement evidence, managed section, decision, known problem, release readiness, or broad handoff extractors. | Later C1 capsules. |
| Build a full graph report or task context report. | Later after enough extractors exist. |
| Add public CLI/read surfaces. | Later graph builder and command registry capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | In Progress | Started docs registry and command registry extractor capsule. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
