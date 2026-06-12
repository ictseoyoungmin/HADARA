# T-0303 Fresh Init + Migration Context Scaffold and Doctor/Docs Cleanliness

## Metadata

| Field | Value |
|---|---|
| ID | T-0303 |
| Title | Fresh Init + Migration Context Scaffold and Doctor/Docs Cleanliness |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Fresh init and 0.3 migration create a committed project context anchor. | `.hadara/context/HADARA_CONTEXT.md` is registered as project context, created for new init scaffolds, planned for missing project migration, and preserved when already present. |

## Scope

| In Scope | Reason |
|---|---|
| Init scaffold context | Create `.hadara/context/HADARA_CONTEXT.md` for basic, standard, and governed profiles and register it in docs registry/required-reading surfaces. |
| Protocol migration context | Project-scoped `protocol migrate --target 0.3.0` plans missing context creation; task-scoped migration does not touch project context. |
| HADARA-dev docs assimilation | Register the rc.2 plan in SOP required reading, add planned slices T-0303 through T-0308, and refresh the current `.hadara/context/HADARA_CONTEXT.md`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Releasing `0.3.0-rc.2` | Reserved for T-0309/T-0310. |
| Required Reading tier command behavior | Reserved for T-0308. |
| Broad docs registry cleanup for HADARA-dev | Only the context/rc.2 plan links needed by this capsule are changed. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-12 | Draft | Initial task scaffold. | `hadara task create`. |
| 2026-06-12 | Active | Implementing T-0303 rc.2 context scaffold and migration scope. | This capsule. |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
