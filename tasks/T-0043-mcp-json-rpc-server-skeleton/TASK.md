# T-0043 MCP JSON-RPC Server Skeleton

## Goal

Add the first stdio JSON-RPC MCP server skeleton for HADARA.

## Scope

- Expose `hadara mcp serve` as a stdio JSON-RPC entry point.
- Support minimal MCP lifecycle requests needed for discovery.
- Report read-only server capability metadata.
- Report the planned read-only tool names from `docs/MCP_BRIDGE_CONTRACT.md`.
- Keep tool execution unimplemented except for a clear read-only skeleton error.
- Avoid file writes, shell execution, provider calls, and write-capable tools.

## Out of Scope

- Implementing read tool behavior.
- Task creation or mutation.
- Evidence attachment.
- Handoff updates.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
