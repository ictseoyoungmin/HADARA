# T-0065 Context Export MCP Instructions

## Goal

Ensure exported HADARA context instructs external agents to use HADARA CLI JSON and read-only MCP surfaces first.

## Scope

- Include roadmap and slice-order documents in exported context.
- Add explicit MCP/CLI read-surface priority guidance to `HADARA_CONTEXT.md`.
- Keep MCP write, shell execution, release/package execution, and multi-agent assumptions out of exported guidance.
- Add regression coverage for the exported instructions.

## Out of Scope

- Implementing new MCP tools.
- Implementing MCP write tools.
- Changing CLI JSON schemas.
- Building the Hermes-like compatibility fixture; that remains T-0066.

## Status

Done
