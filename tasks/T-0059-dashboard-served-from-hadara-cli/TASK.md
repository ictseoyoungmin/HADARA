# T-0059 Dashboard Served from HADARA CLI

## Goal

Serve the static dashboard reference through a HADARA CLI entry point without adding live status execution, MCP connections, writes, or a frontend build step.

## Scope

- Add a `hadara dashboard serve` command.
- Serve only the static dashboard HTML and sample fixture from an allowlisted route set.
- Add tests for the served HTML, fixture response, and static/no-live-integration boundary.
- Document that the command serves sample data only.

## Out of Scope

- Live `hadara ops status --json` execution from the dashboard.
- Live MCP, WebSocket, EventSource, or backend mutation behavior.
- Browser state persistence.
- React/Vite or bundled frontend assets.

## Status

Done
