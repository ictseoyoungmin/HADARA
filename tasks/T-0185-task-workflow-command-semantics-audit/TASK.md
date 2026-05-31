# T-0185 Task Workflow Command Semantics Audit

## Metadata

| Field | Value |
|---|---|
| ID | T-0185 |
| Title | Task Workflow Command Semantics Audit |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Define task workflow command semantics. | Document the standard task loop and clarify command roles, read/write boundaries, dry-run behavior, and `ok` semantics before Phase 4 UI/read-surface work. |

## Scope

| In Scope | Reason |
|---|---|
| Add task workflow command guidance to docs. | Operators and external agents need one source of truth for `task status`, `ready`, `finish`, `close`, `audit-close`, `next`, and `evidence add-command`. |
| Align README, SOP, AGENTS, and CLI JSON contract references. | These are the likely entry points for future agents and UI/MCP consumers. |
| Add regression coverage for the documented loop and command semantics. | Prevent later docs drift from reintroducing command ambiguity. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New task workflow implementation behavior. | This capsule is an audit/documentation slice, not a new command implementation. |
| Broad automatic state writes. | `task finish` and `task close` write boundaries remain unchanged. |
| Phase 4 UI implementation. | This prepares for UI/read-surface work but does not start it. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | `hadara task create "Task Workflow Command Semantics Audit"` |
| 2026-05-31 | Active | Scope set to task workflow command semantics audit. | `docs/TASK_WORKFLOW_COMMANDS.md` draft and docs regression tests. |
| 2026-05-31 | Done | Workflow command semantics docs, tests, and evidence completed. | Docker sync-build and focused docs regression passed. |
