# T-0226 Dashboard Refresh Responsiveness Measurement

## Metadata

| Field | Value |
|---|---|
| ID | T-0226 |
| Title | Dashboard Refresh Responsiveness Measurement |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Fix dashboard refresh responsiveness measurement and stage duration metadata. | Add an operator measurement path that records `/api/dashboard/core` p50/p95 while refresh is running, verifies task-signals batch progress, compares workspace `/mnt/f` with `/tmp` ext4 when requested, and exposes per-stage duration metadata in projection status. |

## Scope

| In Scope | Reason |
|---|---|
| Refresh stage duration metadata. | Projection status must identify current and completed stage timings, including slow-stage warnings. |
| Responsiveness measurement script. | Operators need repeatable p50/p95 core timing and task-signals progress observations during refresh. |
| Measurement documentation and evidence. | The next performance decision should be based on recorded command output, not subjective UI feel. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| fsp.opendir streaming task scan. | This is the likely T-0228 follow-up if measurements show directory listing cost is still dominant. |
| Hard latency budgets that fail routine checks. | This capsule records operational criteria and observations; stable enforcement belongs after the measurements settle. |
| Dashboard UI redesign. | T-0225 already aligned stale/pending UI semantics; this task is an operations/measurement slice. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-03 | In Progress | Scope fixed to measurement plus refresh duration metadata. | Task capsule update |
| 2026-06-03 | Done | Finished and closed T-0226. | `task finish`, `task close`, and `task audit-close` |
