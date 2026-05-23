# T-0048 Gated MCP Evidence Attach Implementation

## Goal

Implement `hadara.evidence.attach` behind an explicit MCP enablement flag.

## Scope

- Add write-capable MCP tool metadata for `hadara.evidence.attach`.
- Keep `hadara.evidence.attach` absent from default `hadara mcp serve`.
- Add explicit CLI opt-in for evidence attach.
- Implement the tool by reusing the existing evidence collect report path.
- Preserve MCP JSON text payload wrapping.
- Preserve workspace boundary and public artifact redaction through existing evidence store helpers.
- Avoid shell execution and provider calls.

## Out of Scope

- Broad write-capable MCP tools.
- Task creation or mutation outside evidence append behavior.
- Handoff updates through MCP.
- Shell execution.
- Provider calls.
- Dashboard integration.

## Status

Done
