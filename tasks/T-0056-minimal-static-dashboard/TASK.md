# T-0056 Minimal Static Dashboard

## Goal

Build a minimal static dashboard that consumes the sample Operations Status JSON fixture.

## Scope

- Add a static dashboard under `docs/design/dashboard/index.html`.
- Load `docs/design/fixtures/hadara.ops.status.sample.json` with an inline fallback.
- Render Operations Home cards for health, task counts, validation, handoff, MCP guard, and issues.
- Follow the comfort dark direction from the mockup.
- Add static smoke tests for fixture shape and dashboard scope boundaries.

## Out of Scope

- Backend services.
- Live CLI execution.
- MCP connection.
- File writes.
- React/Vite or any build step.
- Provider/run/queue UI.
- Dashboard served from HADARA CLI.

## Status

Done
