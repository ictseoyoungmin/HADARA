# T-0384 Cache Warm Diagnostics Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0384 |
| Title | Cache Warm Diagnostics Cleanup |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Improve cache status/warm operator diagnostics. | Cache reports should explain missing/stale/corrupt/partial states, slow mounted paths, and exact warm commands without changing cache write boundaries. |

## Scope

| In Scope | Reason |
|---|---|
| Add additive diagnostics to `context cache status` and `context cache warm` reports. | Keeps existing JSON contract compatible while making operator action clear. |
| Detect partial warm cache state. | Fresh source manifest with missing/stale/corrupt shards should not look fully healthy. |
| Preserve explicit warm execute boundary. | Diagnostics may recommend a command but must not write during status/dry-run reads. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime optimization of broad mounted source-manifest scans. | This capsule improves observability; T-0385+ can decide whether deeper optimization is required. |
| Changing cache file layout or cache truth semantics. | Cache remains local, rebuildable, and lower authority than source. |
| Running warm execute against the live workspace as validation. | Avoid mutating `.hadara/local/cache/context` during normal capsule validation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | TBD |
| 2026-06-19 | In Progress | Implementing additive cache diagnostics and tests. | TBD |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
