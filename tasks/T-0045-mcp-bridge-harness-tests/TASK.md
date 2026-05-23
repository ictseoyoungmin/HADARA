# T-0045 MCP Bridge Harness Tests

## Goal

Add contract tests that validate MCP bridge outputs against existing HADARA CLI JSON contracts.

## Scope

- Test that MCP tool results are one JSON text content item.
- Compare `hadara.task.list` payloads to the existing task list report builder.
- Compare `hadara.policy.evaluate` payloads to policy preflight reports.
- Compare `hadara.harness.validate` payloads to harness validation reports.
- Cover `hadara.task.read`, `hadara.handoff.read`, and `hadara.project.state.read` contract shape.
- Cover JSON-RPC notification no-response behavior.
- Cover tool dispatch error mapping for HADARA issue codes.
- Keep tests read-only with no shell execution or provider calls.

## Out of Scope

- New MCP tools.
- Write-capable tools.
- Evidence attachment.
- Handoff updates.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
