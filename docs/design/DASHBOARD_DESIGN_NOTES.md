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

T-0056 provides a minimal static dashboard reference that consumes the sample Operations Status JSON fixture. It has no backend, live CLI execution, MCP connection, file writes, or build step.

Recommended next slices:

1. T-0057 Dashboard Fixture Smoke
2. T-0058 Dashboard served from HADARA CLI
