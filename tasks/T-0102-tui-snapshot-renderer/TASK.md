# T-0102 TUI Snapshot Renderer

## Goal

Add a deterministic no-color snapshot renderer over the internal TUI read-model aggregate.

## Scope

- Add `src/tui/snapshot.ts`.
- Render Overview, Tasks, Detail, and Help panels from `TuiReadModel`.
- Support fixed width and height with clipping and padding.
- Return text plus line arrays in an internal snapshot envelope.
- Add tests for all panels, narrow clipping, no ANSI color, and no-write behavior.

## Out of Scope

- Interactive terminal input.
- `hadara tui` CLI entry point.
- Runtime schema registration for TUI snapshots.
- Color themes, mouse support, cache writes, shell execution, provider calls, MCP calls, or Task Capsule mutation.

## Status

Done
