# T-0230 TUI Projection-First Task Index Cache Replacement

## Metadata

| Field | Value |
|---|---|
| ID | T-0230 |
| Title | TUI Projection-First Task Index Cache Replacement |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Replace broad TUI task index reads with projection-first task summaries. | `/mnt/f` snapshot smoke must stop scanning every task capsule before rendering. |

## Scope

| In Scope | Reason |
|---|---|
| TUI task list source order. | Prefer dashboard task projection, merge Task Board rows, and fall back to legacy task scan only when neither source exists. |
| Selected task document reads. | Read the selected/current/previous capsule directly from summary paths instead of scanning all task capsules to find IDs. |
| TUI cache source signals. | Validate fast cache from Task Board/projection/selected-task signals rather than recomputing every task hash. |
| Snapshot smoke read profile. | Route `hadara tui --snapshot` and feature smoke through the projection-first fast profile. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Dashboard refresh optimization. | Dashboard work is paused after Phase 5.7; this capsule only consumes existing projection artifacts. |
| Streaming directory scan implementation. | If projection/Task Board sources are absent, legacy fallback may still scan tasks. |
| Mutation or repair of missing task capsules. | TUI remains read-only and treats Task Board/projection as the operator source-of-truth. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-03 | In Progress | Scope fixed to projection-first task index/cache replacement and built snapshot smoke reduction. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |

