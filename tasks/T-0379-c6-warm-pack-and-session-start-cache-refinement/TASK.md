# T-0379 C6 Warm Pack and Session Start Cache Refinement

## Metadata

| Field | Value |
|---|---|
| ID | T-0379 |
| Title | C6 Warm Pack and Session Start Cache Refinement |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Let default `hadara session start --json` consume proven-fresh warm context cache without live scans. | If graph-core/code-index cache freshness is proven by the cached source manifest fast path, Session Start should return richer graph-backed context; otherwise it must keep the bounded no-live fallback from T-0378. |

## Scope

| In Scope | Reason |
|---|---|
| Default Session Start warm-cache read path. | C5 should benefit from explicit `context cache warm --execute` without making mounted workspaces hang. |
| Focused tests for warm hit and no-write fallback. | The cache path must remain read-only and must not regress bounded defaults. |
| Command docs/spec status drift for the refined behavior. | Consumers need to know that default Session Start may read fresh cache but will not live-scan. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Background cache warm or implicit writes. | Read commands must remain non-mutating. |
| Full C6 performance-regression gate. | This task improves one warm consumer path; C6.10 fixture gating remains follow-up. |
| Parser-backed code extraction or new graph schema. | Existing code-index/cache records are sufficient for this refinement. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | task create |
| 2026-06-19 | In Progress | Started warm-pack/session-start cache refinement implementation. | T-0379 |
| 2026-06-19 | Done | Default Session Start can consume proven-fresh warm graph-core/code-index cache read-only, with bounded no-live fallback retained. | ev:T-0379:fb174f9ca4254d2b9aa4bec9 |
<!-- hadara:managed:end task-status-history -->
