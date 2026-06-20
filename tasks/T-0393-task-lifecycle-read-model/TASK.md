# T-0393 Task Lifecycle Read Model

## Metadata

| Field | Value |
|---|---|
| ID | T-0393 |
| Title | Task Lifecycle Read Model |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only task lifecycle phase API for agents. | Implement `hadara task lifecycle --task T-XXXX --json` over existing finish/ready/close/audit read models without adding lifecycle writes. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara.task.lifecycle.v1` schema and report builder. | Agents need one normalized phase/check/next-action read model. |
| CLI route and command registry metadata. | The surface must be discoverable and runnable from built CLI. |
| Documentation updates for JSON/command/schema/workflow references. | Consumers need the command contract without reading source. |
| Focused tests, full Docker sync-build, and built CLI smoke. | This is a runtime command surface. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `task close-repair-plan`. | Planned for T-0394 so stale/invalid repair can be tested independently. |
| `task finalize` dry-run or execute orchestration. | Planned for later capsules after read-only lifecycle proves useful. |
| Shared-state document writes from lifecycle. | The command is read-only by design. |
| Performance optimization of underlying ready/close/audit scans. | The first implementation composes existing models; optimization can follow once behavior is stable. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | task create |
| 2026-06-20 | In Progress | Implemented read-only task lifecycle report, CLI route, docs, and tests. | ev:T-0393:bc944ecc2c894e869dd7e557 |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
