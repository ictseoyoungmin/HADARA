# T-0373 C6 ext4 Mounted Performance Baseline

## Metadata

| Field | Value |
|---|---|
| ID | T-0373 |
| Title | C6 ext4 Mounted Performance Baseline |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Measured C6 mounted/ext4 baseline | Add a repeatable built-CLI performance measurement script, record observed mounted vs ext4 context-routing timings, and feed the result back into C6 implementation priority. |

## Scope

| In Scope | Reason |
|---|---|
| Context-routing performance script | Needed so mounted/ext4 comparisons are repeatable without dumping large graph JSON to the terminal. |
| Built CLI mounted/ext4 measurement | User asked whether both ext4 and mounted environments were compared. |
| C6 spec and docs registry updates | The measured result must guide next implementation order and remain discoverable. |
| Task capsule evidence and handoff | HADARA task proof must track the measurement and decision. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime graph/cache optimization | This capsule measures and routes the next work; it does not implement warm graph/pack shards. |
| Cache warm `--execute` writes | Read/write boundary is preserved; benchmark uses dry-run cache warm only. |
| Stable CI performance gate | These timings are local observations, not deterministic CI thresholds. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | In Progress | Measuring mounted and ext4 C6 context-routing behavior before resuming implementation. | TBD |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
