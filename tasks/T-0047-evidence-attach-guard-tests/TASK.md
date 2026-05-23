# T-0047 Evidence Attach Guard Tests

## Goal

Add guard tests that keep MCP evidence attachment contract-only until an implementation capsule explicitly enables it.

## Scope

- Reserve future MCP write-tool issue codes in code.
- Test that `hadara.evidence.attach` is not advertised by `tools/list`.
- Test that calling `hadara.evidence.attach` returns `TOOL_NOT_FOUND`.
- Test that the future evidence attach contract documents required write-tool safety codes.
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
