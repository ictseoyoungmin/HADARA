# T-0225 Dashboard Cooperative Refresh Progress

## Metadata

| Field | Value |
|---|---|
| ID | T-0225 |
| Title | Dashboard Cooperative Refresh Progress |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Make dashboard projection refresh cooperative and observable without blocking core reads. | `/api/dashboard/core` must return current/stale/pending projection state immediately while refresh progress reports current stage, processed/total, and yield timestamps. |

## Scope

| In Scope | Reason |
|---|---|
| Refresh progress contract | Operators need `currentStage`, `processed`, `total`, and `lastYieldAt` to distinguish a running refresh from a stalled dashboard. |
| Cooperative task projection rebuild | Task projection rebuild must yield between batches and update progress as batches complete. |
| Non-blocking core route semantics | Core route must never await refresh completion; stale projections stay usable and missing sections are pending. |
| UI refresh alignment | The browser Refresh action should trigger projection refresh and keep rendering stale/pending state instead of waiting for completion. |
| Focused regression tests | Completion needs tests for progress metadata, batch yielding, and frontend route expectations. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Worker threads or external queues | This slice stays inside the single-process local dashboard server. |
| Full source-signal freshness proof for every source | This slice can expose honest stale/unknown states without adding expensive all-source scans to core reads. |
| New dashboard write/action behavior | Dashboard remains read-only and memory-only from the browser. |
| Full visual/a11y screenshot refresh | Static route/source tests and fixture updates are sufficient unless UI layout changes require the visual gate. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` output. |
