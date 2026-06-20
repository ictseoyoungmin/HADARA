# T-0388 Context Pack Read Recommendation Boundary Metadata

## Metadata

| Field | Value |
|---|---|
| ID | T-0388 |
| Title | Context Pack Read Recommendation Boundary Metadata |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Clarify context-pack read recommendations that point at paths outside the raw context-slice boundary. | Add item-level metadata that separates graph relevance from raw slice readability without dropping useful graph context. |

## Scope

| In Scope | Reason |
|---|---|
| Add additive source-access metadata to `ContextPackItem`. | Consumers need to know whether a recommended item can be read through `hadara context slice`. |
| Preserve existing `readFirst` / `readIfNeeded` ranking behavior. | Graph relevance should not be silently lost just because a path is not raw-sliceable. |
| Update schema/spec docs and tests. | The JSON contract change is additive but should be documented and validated. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Remove denied paths from `readFirst` / `readIfNeeded`. | That changes ranking semantics and could hide relevant graph context. |
| Add new raw slice overrides or cache-read flags. | This task is metadata-only for context pack consumers. |
| Change context slice read boundaries. | T-0387 already centralized those boundaries. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | TBD |
| 2026-06-20 | In Progress | Additive source-access metadata implementation started. | TBD |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
