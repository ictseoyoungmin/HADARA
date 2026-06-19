# T-0371 C6 Speed-First Graph Cache Spec Refresh

## Metadata

| Field | Value |
|---|---|
| ID | T-0371 |
| Title | C6 Speed-First Graph Cache Spec Refresh |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add a speed-first C6 graph/cache implementation spec. | Produce a docs-registered Markdown spec that treats latency as a product requirement, compares Graphify-derived ideas against HADARA boundaries, and lists concrete code changes needed for future implementation. |

## Scope

| In Scope | Reason |
|---|---|
| New C6 speed-first graph/warm-path spec under `docs/specs/0.3.3/context-routing/`. | Keeps the execution-focused performance design separate from the existing broader C6 implementation history/spec. |
| Registry and read-routing references. | Make the new spec discoverable from SOP, DOC_REGISTRY, worker plan, and docs registry metadata. |
| Task capsule evidence and handoff. | Preserve HADARA task protocol even for docs-only spec work. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime/source implementation. | This task is spec-only; future C6.6+ capsules should implement code-index shard persistence, graph-core shards, and pack warm paths. |
| Full benchmark harness. | The spec defines evidence requirements but does not add runtime timing fixtures. |
| Replacing existing C6 specs. | The new document extends 05/07 rather than superseding them. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-19 | In Progress | Scoped docs-only C6 speed-first spec refresh after user requested a Graphify-aware performance design. | TASK/PLAN/CONTEXT updates |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
