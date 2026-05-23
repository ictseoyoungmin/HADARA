# T-0046 Evidence Attach Tool Contract

## Goal

Define a future write-capable MCP evidence attach tool contract without implementing write behavior.

## Scope

- Document a future `hadara.evidence.attach` MCP tool contract.
- Define required safety gates for evidence writes.
- Expand MCP tool error taxonomy for future write-capable tools.
- Clarify that `hadara.policy.evaluate` reports policy evaluation only and never grants MCP execution authority.
- Keep current MCP runtime read-only.

## Out of Scope

- Implementing `hadara.evidence.attach`.
- Advertising write-capable MCP tools.
- Writing evidence through MCP.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
