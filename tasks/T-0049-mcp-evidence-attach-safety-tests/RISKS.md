# Risks

| Risk | Mitigation |
|---|---|
| Evidence attach bypasses artifact safety checks. | Test workspace boundary and public artifact redaction through MCP. |
| MCP tool errors blur transport and command-report failures. | Test schema errors as JSON-RPC `TOOL_INPUT_INVALID` and evidence policy failures as evidence collect report issues. |
| Default MCP server becomes write-capable by accident. | Keep guard coverage from T-0047/T-0048 in the full suite. |
