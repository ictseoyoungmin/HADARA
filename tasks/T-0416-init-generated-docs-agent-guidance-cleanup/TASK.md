# T-0416 Init Generated Docs Agent Guidance Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0416 |
| Title | Init Generated Docs Agent Guidance Cleanup |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Improve generated init docs for agent startup | Fresh `hadara init` projects should show the 0.3.4 agent loop in the useful order: `task next`, `session start`, `task lifecycle`, reviewed `task finalize`. |

## Scope

| In Scope | Reason |
|---|---|
| Generated `AGENTS.md` | Add a compact default agent loop that shows the current command order before broader rules. |
| Generated `docs/IMPLEMENTATION_SOP.md` | Include `session start` in the standard task workflow loop and describe the context-aware 0.3.4 path. |
| Generated `docs/TASK_WORKFLOW_COMMANDS.md` | Include `session start` in the standard loop while keeping low-level proof-boundary commands as debugging/recovery tools. |
| Tests | Update init scaffold tests to lock the new command order. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New init profiles or migrations | This capsule only changes current generated docs, not profile shape or upgrade semantics. |
| Runtime lifecycle behavior | No command execution semantics change. |
| Optional integrations | Hermes/MCP/provider guidance remains opt-in and out of default init docs. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25 | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | In Progress | Scope narrowed to generated-doc agent startup guidance cleanup. | TBD |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
