# T-0049 MCP Evidence Attach Safety Tests

## Goal

Add focused safety tests for opt-in MCP evidence attachment.

## Scope

- Test MCP evidence attach payload parity with the existing evidence collect report shape.
- Test public artifact attachment succeeds for safe project-local text.
- Test workspace boundary rejection for artifact paths outside the project.
- Test public artifact secret redaction rejection.
- Test invalid evidence attach inputs return `TOOL_INPUT_INVALID`.
- Keep default MCP startup behavior read-only.

## Out of Scope

- New MCP write tools.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
