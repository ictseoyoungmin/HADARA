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

## Relationship to TUI

The browser dashboard and terminal TUI are separate operations surfaces over the same HADARA read models.

- Dashboard: visual browser operations home, served locally through `hadara dashboard serve`, with read-only local API routes already implemented.
- TUI: future local terminal work console, documented in `docs/design/TUI_DESIGN_NOTES.md`, optimized for current work, task selection, Task Capsule document reading, and SSH/WSL/Docker terminal use.

Both surfaces must preserve the same initial boundary: no shell execution, provider calls, MCP writes, evidence writes, task mutation, release/package execution, or browser/TUI state treated as committed evidence.

Recommended next slices:

1. T-0058 Dashboard Fixture Binding Smoke
2. T-0059 Dashboard served from HADARA CLI
