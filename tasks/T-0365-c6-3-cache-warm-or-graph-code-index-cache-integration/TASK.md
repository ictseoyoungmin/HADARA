# T-0365 C6.3 Cache Warm or Graph Code Index Cache Integration

## Metadata

| Field | Value |
|---|---|
| ID | T-0365 |
| Title | C6.3 Cache Warm or Graph Code Index Cache Integration |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Harden the C6 fast context cache/performance implementation spec before the next cache-warm or graph/code-index integration slice. | The user asked for a C6 Markdown spec that prioritizes speed, absorbs useful Graphify lessons, and records existing code changes needed for implementation. |

## Scope

| In Scope | Reason |
|---|---|
| Update `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`. | This is the registered detailed C6 implementation spec. |
| Record Graphify-inspired lessons and HADARA-specific differences. | The requested comparison should guide implementation without importing Graphify's output/truth model. |
| Define speed-first cold-build, warm-cache, shard invalidation, and code-change requirements. | C6 is only useful if graph/index/pack reads become fast enough for routine agent startup. |
| Keep the work documentation-only unless a required consistency edit is discovered. | Implementation should follow in a separate focused cache-warm/integration capsule. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implementing `context cache warm`. | The current request is for the spec document; command implementation remains a follow-up. |
| Rewiring `context graph`, `context pack`, or code index to consume cache. | The spec should define the path, not mix design with behavior changes. |
| Adding new cache schemas or command registry entries. | No new public command is being added in this docs-only slice. |
| Running full Docker validation. | No TypeScript/runtime code is changed; docs consistency checks are sufficient. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | Task created |
| 2026-06-19 | In Progress | Re-scoped to C6 fast-cache performance spec hardening before implementation. | Current worktree |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
