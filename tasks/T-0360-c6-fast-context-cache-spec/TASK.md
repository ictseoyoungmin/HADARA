# T-0360 C6 Fast Context Cache Spec

## Metadata

| Field | Value |
|---|---|
| ID | T-0360 |
| Title | C6 Fast Context Cache Spec |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Write a detailed C6 fast context cache and performance implementation spec. | The spec must prioritize speed, define how to improve cold and warm graph/index generation, compare/adapt Graphify-style manifest/update ideas, and identify existing HADARA code changes needed for implementation. |

## Scope

| In Scope | Reason |
|---|---|
| Add a C6 detailed implementation spec under `docs/specs/0.3.3/context-routing/`. | User requested an md spec document for C6. |
| Link the detailed C6 spec from existing C6 and worker routing docs. | Future workers need deterministic read routing. |
| Register the new spec in Required Reading and docs registry surfaces. | Project-specific specs must be registered before agents rely on them. |
| Update capsule and shared state docs for the docs-only task. | Required by HADARA close workflow. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement persistent cache/source-manifest code. | This task writes the implementation spec only. |
| Add new CLI commands or JSON schemas in source code. | The spec identifies required future changes; implementation should be separate capsules. |
| Run full Docker/runtime validation. | No runtime/source behavior changes are planned; docs validation is sufficient unless close gates require more. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
