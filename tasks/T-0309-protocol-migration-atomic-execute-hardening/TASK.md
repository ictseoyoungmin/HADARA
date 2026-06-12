# T-0309 Protocol Migration Atomic Execute Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0309 |
| Title | Protocol Migration Atomic Execute Hardening |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Harden multi-file protocol migration execute and docs cleanup registry writes against partial writes. | Reviewer feedback identified partial migration risk before rc.2 readiness. |

## Scope

| In Scope | Reason |
|---|---|
| `protocol migrate --execute` multi-file write transaction. | Prevent partial adoption when a later file conflicts or write fails. |
| `docs mark --execute` registry write. | Use temp+rename instead of direct overwrite for the registry. |
| Common atomic text write helper. | Keep file-write behavior shared and reusable. |
| rc.2 plan and roadmap numbering. | Insert this hardening as T-0309 and shift later rc.2 tasks by one. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `0.3.0-rc.2` version bump and release readiness checks. | Shifted to T-0310. |
| Post-publish installed-package recycle. | Shifted to T-0311. |
| Broad adoption migration redesign. | This task only hardens current execute/write semantics. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
