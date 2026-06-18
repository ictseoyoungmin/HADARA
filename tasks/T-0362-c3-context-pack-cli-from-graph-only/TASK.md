# T-0362 C3 Context Pack CLI from Graph Only

## Metadata

| Field | Value |
|---|---|
| ID | T-0362 |
| Title | C3 Context Pack CLI from Graph Only |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Expose the internal C3 context pack report builder as a read-only public CLI surface. | This is C3 capsule 2: `hadara context pack --task T-XXXX --json` over current C1/C2 graph output, without C4 slicing or C6 cache writes. |

## Scope

| In Scope | Reason |
|---|---|
| Add `context pack` handling to the existing context CLI handler. | Reuse `buildContextPackReport()` from T-0361 and keep command behavior read-only. |
| Support task-scoped context pack JSON with optional `--include-code`, `--budget`, and bounded item flags. | Match C3 spec examples while preserving graph-only computation. |
| Register `context.pack` in the command registry and CLI JSON docs. | Public command surfaces need registry metadata and contract docs. |
| Add focused CLI/registry tests and built CLI smoke validation. | Public command exposure needs command-level coverage. |
| Update state docs and capsule docs. | HADARA close workflow requires current docs before finish/ready/close. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| C4 `context slice` implementation. | Slice candidates are metadata only until C4 begins. |
| C5 `session start`. | Session start is a later consumer after context pack stabilizes. |
| C6 persistent source manifest/cache reads or writes. | This CLI must remain cache-compatible but not implement cache infrastructure. |
| Dedicated public `hadara code` commands. | Code index remains an internal projection through `--include-code`. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
