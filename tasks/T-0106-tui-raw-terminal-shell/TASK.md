# T-0106 TUI Raw Terminal Shell

## Goal

Add the first internal raw-terminal shell over the tested TUI read model, snapshot renderer, and interaction state so a future public CLI entry point can reuse deterministic key handling, redraw, refresh, and shutdown behavior.

## Scope

- Add an internal TypeScript terminal module for key decoding, redraw loop orchestration, terminal-size handling, refresh/detail refresh effects, and clean shutdown.
- Keep all project data access on existing read-model services and all rendering on the snapshot renderer.
- Support injected input/output streams so behavior can be tested without a real terminal.
- Preserve the read-only boundary: no CLI entry point, cache writes, shell execution, provider calls, MCP calls, evidence writes, handoff updates, or Task Capsule mutation from the TUI shell.
- Add focused unit tests for key decoding, redraw/refresh behavior, clean shutdown, and no project-file writes.

## Out of Scope

- Public `hadara tui` command.
- Mouse handling.
- ANSI color styling beyond minimal terminal control needed for redraw.
- Terminal cache or persistence.
- Task/evidence/handoff mutation.
- Shell execution, provider execution, MCP calls, dashboard/server behavior, release/package behavior.

## Status

Done
