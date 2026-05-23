# T-0058 Dashboard Fixture Binding Smoke

## Goal

Verify the adopted dashboard shell remains bound to `hadara.ops.status.v1` fixture fields without drifting into unvalidated placeholder data.

## Scope

- Add focused static smoke coverage for dashboard `data-field` attributes.
- Confirm every fixture-backed field in the HTML maps to sample fixture or supported derived values.
- Preserve the static dashboard boundary: no live CLI execution, MCP connection, backend service, file writes, or persisted browser state.

## Out of Scope

- Serving the dashboard from the HADARA CLI.
- Live status refresh from `hadara ops status --json`.
- Browser automation or screenshot baselines.
- React/Vite or any build step.

## Status

Done
