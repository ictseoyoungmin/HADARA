# T-0057 Dashboard Mockup Adoption

## Goal

Adopt the comfort dark mockup as the preferred HADARA dashboard shell while keeping `hadara.ops.status.v1` as the authoritative data contract.

## Scope

- Replace the minimal static dashboard shell with a comfort dark mockup-inspired shell.
- Preserve topbar, sidebar, metric cards, task/evidence/handoff/gate cards, and dark visual hierarchy.
- Bind dashboard values from `docs/design/fixtures/hadara.ops.status.sample.json` and inline fallback data.
- Use data-field attributes for key fixture-backed elements.
- Keep the static dashboard boundary tests in place and expand them for mockup adoption.

## Out of Scope

- Live CLI execution.
- Live MCP connection.
- Backend services.
- File writes.
- React/Vite or any build step.
- localStorage, WebSocket, EventSource, or state persistence.
- Implementing all mockup pages/tabs.

## Status

Done
