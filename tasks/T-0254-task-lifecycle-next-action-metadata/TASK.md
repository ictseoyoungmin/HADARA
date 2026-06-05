# T-0254 Task Lifecycle Next Action Metadata

## Metadata

| Field | Value |
|---|---|
| ID | T-0254 |
| Title | Task Lifecycle Next Action Metadata |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add Phase 6 actor and next-action metadata to task lifecycle reports. | Make finish, ready, close, and audit-close reports expose common actor context plus structured next actions without executing other commands. |

## Scope

| In Scope | Reason |
|---|---|
| Add default `actor` metadata to task finish, ready, close, and audit-close reports. | T-0253 established common actor context; lifecycle reports are the first adoption target. |
| Add structured `nextActions` fields and optional `primaryNextAction`. | Operators and future workers need write boundary, recommended actor role, before-hash, and stale-plan metadata. |
| Update task lifecycle schemas and tests. | The additive report contract should be explicit and covered. |
| Update docs and evidence. | Phase 6 workflow-compression boundaries must stay visible. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Executing another lifecycle command from a report. | T-0254 is metadata-only and must not orchestrate commands. |
| `task complete` dry-run command. | Deferred to T-0255 after lifecycle next actions exist. |
| Requiring actor CLI options on existing commands. | Existing command invocation compatibility is preserved. |
| Shared-doc apply or `task complete --execute`. | Deferred by Phase 6 safety boundaries. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-05 | In Progress | Started lifecycle next-action metadata implementation. | Focused lifecycle tests |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |

