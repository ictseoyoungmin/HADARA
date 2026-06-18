# T-0350 C1 State Projection and Consistency Diagnostics

## Metadata

| Field | Value |
|---|---|
| ID | T-0350 |
| Title | C1 State Projection and Consistency Diagnostics |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Add C1 compact state projection over context graph extraction results. | Preserve the existing Phase 8 `hadara state verify` CLI report while adding the context graph projection/diagnostics needed before graph builder assembly. |

## Scope

| In Scope | Reason |
|---|---|
| Project State and Agent Handoff state-source extraction. | C1 projection needs latest/active task hints from shared state docs, not only graph nodes. |
| Compact `ContextStateProjectionReport` builder from extractor outputs. | The context graph report schema embeds a compact state projection with `StateSource[]` and bounded issue codes. |
| Consistency diagnostics for latest task, active task, missing rows/capsules, and close proof drift. | These are the high-value C1 checks needed before task context routing. |
| Focused unit tests and Docker validation. | Projection behavior must be deterministic and non-mutating. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Replacing the existing `src/services/state-projection.ts` report or `hadara state verify` CLI shape. | Existing Phase 8 consumers depend on the richer read model. |
| Graph builder, task context ranking, cache, or public context CLI integration. | Those are later C1 capsules after projection diagnostics exist. |
| Automatic repair of inconsistent state. | This capsule only reports diagnostics. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18 | Draft | Initial task scaffold. | task create output |
| 2026-06-18 | In Progress | Started C1 compact state projection and diagnostics implementation. | PLAN.md |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
