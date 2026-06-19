# T-0366 C6.3 Cache Warm Phase 1 Implementation

## Metadata

| Field | Value |
|---|---|
| ID | T-0366 |
| Title | C6.3 Cache Warm Phase 1 Implementation |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Add explicit `hadara context cache warm --json` and `--execute --json` phase 1 for source-manifest cache population. | This turns the C6.2 status/store foundation into a dry-run-first write surface while keeping ordinary context read commands non-mutating. |

## Scope

| In Scope | Reason |
|---|---|
| `context cache warm --json` dry-run report. | Operators can inspect planned source-manifest cache writes before mutation. |
| `context cache warm --execute --json` source-manifest cache write. | Phase 1 should make `context cache status --json` report a hit when sources are unchanged. |
| `hadara.context.cacheWarm.v1` schema, schema index/runtime registration, command registry, CLI JSON/command/docs updates. | Public JSON command surfaces need explicit contracts and discoverability. |
| Focused cache store/CLI/schema/registry tests. | Validate write boundary, schema shape, and command metadata. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Graph/code-index/context-pack cache consumption. | Phase 1 only warms source-manifest cache. |
| Extractor shard cache writes. | Requires later shard schemas and invalidation planning. |
| Background hooks/watchers. | Cache writes remain explicit and dry-run-first. |
| C4 context slicing. | C4 follows after speed foundation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | Task created |
| 2026-06-19 | In Progress | Started C6.3 cache warm phase 1 implementation. | Current worktree |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
