# T-0015 CLI Evidence JSON

## Goal

Continue CLI JSON normalization by adding a stable machine-readable envelope for `hadara evidence collect --json`.

## Scope

- Add a versioned evidence collect JSON envelope.
- Preserve existing non-JSON evidence collect output.
- Include the appended `hadara.evidence.v1` index record in JSON output.
- Keep private evidence paths suppressed in JSON output.
- Return exit code `6` when the target Task Capsule is missing.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- Copying artifacts into managed evidence storage.
- Binary/log artifact handling.
- Encrypted private evidence storage.
- Evidence list/read commands.
- Dashboard, MCP body, real provider adapters, or full agent loop.

## Status

Done
