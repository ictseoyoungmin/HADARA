# T-0054 Operations Status JSON Cleanup

## Goal

Harden the Operations Status JSON read model so dashboards can distinguish complete, degraded, and partially missing project state.

## Scope

- Add warning issues for missing source documents.
- Keep task count keys stable and move raw status names to `rawStatusCounts`.
- Improve project phase parsing for explicit phase markers.
- Fall back to `docs/VALIDATION_HISTORY.md` when handoff validation baseline lines are missing.
- Clarify that MCP status in this snapshot is configured capability state, not live process state.

## Out of Scope

- Dashboard UI implementation.
- Live MCP server process inspection.
- Latest MCP audit event inspection.
- Provider calls.
- Shell execution.

## Status

Done
