# T-0395 Lifecycle Guidance Dedup Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0395 |
| Title | Lifecycle Guidance Dedup Hardening |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Remove redundant close dry-run next actions after validation already passed. | When `task close --json` has already run done validation, evidence lint, and protocol doctor successfully, the primary next action should be the close execute command, not rerunning the same checks. |

## Scope

| In Scope | Reason |
|---|---|
| `task close --json` dry-run next-action ordering/content | This is where agents see duplicated ready/close guidance. |
| Focused lifecycle/complete-flow compatibility tests | `task lifecycle` and `task complete` reuse close-plan actions. |
| Built CLI smoke against the real workspace | Proves the agent-facing JSON surface has one actionable close next action. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Changing validation semantics or close preconditions | The command still runs the same checks before close evidence append. |
| `task finalize` implementation | Reserved for T-0396/T-0397. |
| Hiding finish/ready/close/audit phases | The canonical lifecycle commands remain separate and visible. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
