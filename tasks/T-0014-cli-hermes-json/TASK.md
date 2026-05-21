# T-0014 CLI Hermes JSON

## Goal

Continue CLI JSON normalization by adding stable machine-readable envelopes for `hadara hermes detect --json` and `hadara hermes export-context --json`.

## Scope

- Add versioned JSON envelopes for Hermes context detection and context export.
- Preserve existing non-JSON Hermes command output.
- Use project-relative portable paths for exported context files.
- Keep export limited to `.hadara/context/HADARA_CONTEXT.md`.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- Hermes binary/version probing.
- Hermes MCP config generation.
- Hermes approval bridge.
- MCP server implementation.
- Evidence CLI JSON normalization.
- Dashboard, real provider adapters, or full agent loop.

## Status

Done
