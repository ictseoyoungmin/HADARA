# T-0219 Background Refresh and Serve Warmup

## Metadata

| Field | Value |
|---|---|
| ID | T-0219 |
| Title | Background Refresh and Serve Warmup |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Move slow dashboard projection work into serve-start/background refresh. | Request path should return stale/missing projection immediately while refresh runs. |

## Scope

| In Scope | Reason |
|---|---|
| Add serve-start warmup trigger. | Warm projections without blocking first response. |
| Add refresh status/read-only trigger semantics. | UI needs checking/refreshing/failed metadata. |
| Preserve no mutation beyond local projection cache. | Refresh is read-model maintenance only. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Incremental changed-task refresh. | T-0220. |
| Timeline/debt projection. | T-0221. |
| File watcher requirement. | Non-goal. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for background refresh and serve warmup. | Task created by HADARA CLI. |
| 2026-06-02 | Done | Added serve-start warmup, refresh/status routes, refresh coalescing, metadata-only projection status, and focused tests; Docker validation gap recorded. | `evidence.add-command` at 2026-06-02T03:14:16.983Z. |
