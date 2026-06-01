# T-0203 Optional Dashboard Polling Refresh

## Metadata

| Field | Value |
|---|---|
| ID | T-0203 |
| Title | Optional Dashboard Polling Refresh |
| Status | Done |
| Created | 2026-06-01 |
| Updated | 2026-06-01 |

## Goal

| Goal | Notes |
|---|---|
| Add optional memory-only polling refresh to the static dashboard. | Polling must be off by default, operator-toggleable, read-only, back off on degraded reads, pause while hidden, and avoid browser persistence, streaming, execution, or mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Dashboard polling toggle. | Operators can opt into repeated read-only refresh without making polling default behavior. |
| Failure backoff and visibility pause. | Prevent request spam and needless background reads. |
| Contract/test updates. | Preserve no SSE/WebSocket/storage/mutation boundaries. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Default-on polling, SSE/WebSocket, browser project-state persistence, shell/provider/MCP writes, task/evidence/release mutation. | Explicitly forbidden by Phase 5.5 scope. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-01 | Draft | Initial task scaffold. | TBD |
| 2026-06-01 | Done | Optional polling refresh implemented and validated. | Docker sync-build passed with 83 files / 561 tests and built CLI smoke `ok:true`. |
