# Dashboard Design Notes

## Current Reference

- `docs/design/mockups/HADARA_web_ui_v0.1_comfort_dark.html`
- `docs/design/dashboard/index.html`
- `docs/design/fixtures/hadara.ops.status.sample.json`

## Intent

The mockup captures future dashboard direction for:

- topbar and sidebar information hierarchy
- comfort dark theme
- operations metric cards
- task and evidence cards
- handoff and validation panels

## Scope Boundary

T-0057 promotes the comfort dark mockup to the preferred dashboard visual baseline. The baseline covers layout direction, hierarchy, palette, card grouping, and navigation feel.

It does not define data schema, live integration, write behavior, MCP behavior, or dashboard state persistence. The authoritative data contract remains `hadara.ops.status.v1`.

The static dashboard consumes the sample Operations Status JSON fixture and has no backend, live CLI execution, MCP connection, file writes, state persistence, or build step.

Recommended next slices:

1. T-0058 Dashboard Fixture Binding Smoke
2. T-0059 Dashboard served from HADARA CLI
