# T-0044 MCP Read Tools Implementation

## Goal

Implement the read-only MCP tools documented in `docs/MCP_BRIDGE_CONTRACT.md`.

## Scope

- Split MCP server tool metadata and dispatch into focused modules.
- Implement `tools/call` parameter validation for `name` and `arguments`.
- Implement `hadara.task.list`.
- Implement `hadara.task.read`.
- Implement `hadara.handoff.read`.
- Implement `hadara.project.state.read`.
- Implement `hadara.policy.evaluate`.
- Implement `hadara.harness.validate`.
- Return MCP tool results as one JSON text payload containing the HADARA report.
- Preserve JSON-RPC notification behavior: notifications produce no response.
- Define first-pass JSON-RPC error mapping for tool dispatch failures.

## Out of Scope

- Write-capable tools.
- Task creation or mutation.
- Evidence attachment.
- Handoff updates.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
