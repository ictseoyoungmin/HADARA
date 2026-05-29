# T-0145 MCP initialize package version metadata

## Goal

Make MCP `initialize` server metadata report the current HADARA package version instead of the stale bootstrap version string.

## Scope

- Replace the hardcoded MCP `serverInfo.version` bootstrap string with metadata loaded from the HADARA package.
- Add regression coverage so MCP initialize tracks `package.json` version.
- Preserve read-only/evidence-attach MCP metadata behavior and tool surfaces.
- Update task-local evidence and handoff.

## Out of Scope

- Changing MCP protocol version.
- Changing MCP tool names, schemas, or dispatch behavior.
- Changing package metadata or publishing a new package.
- Adding MCP write, shell, provider, release, or package execution behavior.

## Status

Done
