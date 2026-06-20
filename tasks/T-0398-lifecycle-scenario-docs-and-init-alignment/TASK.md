# T-0398 Lifecycle Scenario Docs and Init Alignment

## Metadata

| Field | Value |
|---|---|
| ID | T-0398 |
| Title | Lifecycle Scenario Docs and Init Alignment |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Align lifecycle scenario documentation and generated init guidance with the T-0393 through T-0397 convenience surfaces. | Keep explicit finish/ready/close/audit-close as canonical proof boundaries while teaching agents when to use `task lifecycle`, `task close-repair-plan`, and guarded `task finalize`. |

## Scope

| In Scope | Reason |
|---|---|
| README lifecycle workflow guidance. | Package-facing guidance should show the reviewed convenience flow without replacing canonical commands. |
| `docs/IMPLEMENTATION_SOP.md` lifecycle loop and command boundary table. | Session workers read this as the main implementation workflow. |
| `docs/COMMAND_SURFACE.md` lifecycle examples. | Command inventory should include the new high-level dry-run/guarded execute path. |
| `src/cli/init.ts` generated project docs. | Fresh HADARA projects should inherit the same lifecycle ergonomics and boundaries. |
| Task Capsule evidence and shared state docs. | Close-source docs must reflect the completed lifecycle convenience line. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime lifecycle command changes. | T-0393 through T-0397 already implemented the command surfaces. |
| Release/publish work. | This capsule only aligns docs and generated scaffold source. |
| Historical scaffold migration. | Existing projects can adopt docs manually or through a future migration capsule if needed. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | TBD |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
