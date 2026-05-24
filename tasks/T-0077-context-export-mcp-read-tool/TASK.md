# T-0077 Context Export MCP Read Tool

## Goal

Expose HADARA context export through the default read-only MCP bridge as an in-memory report, without generating or mutating `.hadara/context/HADARA_CONTEXT.md`.

## Scope

- Add a shared context export report builder with schema `hadara.context.export.v1`.
- Keep CLI `hadara hermes export-context` as the file-writing path.
- Advertise read-only MCP tool `hadara.context.export`.
- Return MCP context export content as a memory payload with `contextPath: null` and `wouldWritePath`.
- Add focused tests proving the tool is advertised, returns context content, and does not write the context file.

## Out of Scope

- New CLI command aliases for `hadara.context.export`.
- Dashboard or live API integration.
- Context summarization beyond accepting the planned `summaryOnly` input.
- File writes, shell execution, provider calls, task mutation, or broad MCP write behavior.

## Status

Done
