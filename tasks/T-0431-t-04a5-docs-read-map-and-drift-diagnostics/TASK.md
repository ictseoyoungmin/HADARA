# T-0431 T-04A5 Docs Read Map and Drift Diagnostics

## Metadata

| Field | Value |
|---|---|
| ID | T-0431 |
| Title | T-04A5 Docs Read Map and Drift Diagnostics |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Goal

| Goal | Notes |
|---|---|
| Add the 0.4 docs read-map and drift diagnostic read models. | Agents need a bounded registry-backed way to decide which docs to read without scanning every spec. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara docs read-map --task T-XXXX --json`. | Required by T-04A5 and later session/context integration. |
| Add registry-derived metadata axes in the read-map output. | Provides read tier, authority, edit policy, and drift guidance without migrating registry storage yet. |
| Add a minimal `hadara docs inbox --json`. | Gives operators a project-level list of registered-doc and unregistered-spec attention items. |
| Add schemas, command registry entries, and focused tests. | Keeps the new JSON surfaces discoverable and contract-tested. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Integrate read-map into session start or context pack. | Planned for T-04A14 and T-04A15. |
| Implement source document hashing in `TASK.md`. | Planned for T-04A8. |
| Implement `complete-spec`, `mark-drift`, or registry mutation for new metadata axes. | Later docs workflow scope. |
| Release, publish, package, installer, or external mutation work. | Excluded from the 0.4 implementation budget. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-30 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-30 | In Progress | T-04A5 implementation started after T-0430 closed-valid. | `hadara task next --json` |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
