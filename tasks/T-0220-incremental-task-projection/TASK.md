# T-0220 Incremental Task Projection

## Metadata

| Field | Value |
|---|---|
| ID | T-0220 |
| Title | Incremental Task Projection |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Refresh changed task projections incrementally. | Editing one task should not force every capsule to be reparsed. |

## Scope

| In Scope | Reason |
|---|---|
| Track source signals for task `TASK.md` and `evidence.jsonl`. | Detect changed tasks cheaply. |
| Recompute per-task summaries only for changed tasks where possible. | Reduce slow-mount refresh cost. |
| Preserve redaction and rebuildability. | Projection cache is disposable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Timeline/debt projection. | T-0221. |
| Browser/frontend merge. | T-0222. |
| Durable evidence v2 writer. | Separate future track. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for incremental task projection. | Task created by HADARA CLI. |
| 2026-06-02 | Done | Added incremental task projection source signals, changed/reused ids, refresh/core integration, and focused tests; Docker validation gap recorded. | `evidence.add-command` at 2026-06-02T03:23:27.341Z. |
