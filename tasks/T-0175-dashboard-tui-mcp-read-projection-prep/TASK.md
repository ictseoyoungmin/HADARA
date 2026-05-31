# T-0175 Dashboard TUI MCP Read Projection Prep

## Metadata

| Field | Value |
|---|---|
| ID | T-0175 |
| Title | Dashboard TUI MCP Read Projection Prep |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Prepare read-only workbench projection consumers. | Document how dashboard, TUI, MCP, and external agents should consume `hadara.task.workbench.v1` without raw file parsing or writes. |

## Scope

| In Scope | Reason |
|---|---|
| Workbench read-model contract. | Add a dedicated consumer contract for `hadara.task.workbench.v1`. |
| Dashboard/MCP guidance. | Point future read consumers at the workbench projection and preserve read-only boundaries. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New dashboard/TUI/MCP implementation. | This capsule prepares boundaries only. |
| Write or execution surfaces. | Workbench projection remains read-only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task created through HADARA CLI. |
| 2026-05-31 | Done | Read projection contract and consumer guidance added. | Docs and validation evidence. |
