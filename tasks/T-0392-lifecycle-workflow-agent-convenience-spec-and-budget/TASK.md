# T-0392 Lifecycle Workflow Agent Convenience Spec and Budget

## Metadata

| Field | Value |
|---|---|
| ID | T-0392 |
| Title | Lifecycle Workflow Agent Convenience Spec and Budget |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Define the lifecycle convenience line for agent ergonomics without weakening HADARA proof boundaries. | Produce a registered 0.3.3 lifecycle spec, improved scenario, and capsule budget for follow-up implementation. |

## Scope

| In Scope | Reason |
|---|---|
| Lifecycle convenience design. | The user requested a budget and spec before implementation. |
| Improved agent scenario. | Follow-up work needs a concrete usage flow to validate against. |
| Capsule budget. | The requested improvements span multiple safe slices. |
| Required-reading/registry alignment. | Future lifecycle capsules need an explicit spec route. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime implementation of new lifecycle commands. | Split into follow-up capsules so this task remains a design/budget slice. |
| Removing existing lifecycle commands. | The spec preserves finish/ready/close/audit-close as canonical. |
| Hidden shared-doc or evidence writes. | Convenience must preserve dry-run-first and explicit write boundaries. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | task create |
| 2026-06-20 | In Progress | Lifecycle convenience spec and budget drafted. | docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md |
| 2026-06-20 | In Progress | Docs registry validation passed. | ev:T-0392:46f350146736461ea9712b18 |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
