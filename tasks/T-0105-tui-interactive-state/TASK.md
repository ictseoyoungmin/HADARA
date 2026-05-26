# T-0105 TUI Interactive State

## Goal

Add the first pure interactive state layer for the internal TUI so later raw terminal work can reuse tested panel, task, search, document-tab, scroll, refresh, and quit transitions.

## Scope

- Add an internal TypeScript TUI state module over the existing read model and snapshot renderer.
- Support read-only state transitions for panel switching, task selection, task search, detail document tabs, document scroll, refresh request, and quit request.
- Keep the implementation free of terminal raw mode, CLI entry points, cache writes, shell execution, provider calls, MCP calls, and Task Capsule mutation.
- Add focused unit tests for state transitions and read-only behavior.

## Out of Scope

- Raw terminal input mode.
- Mouse handling.
- A `hadara tui` CLI command.
- Live refresh loops, timers, caching, or persistence.
- Any write-capable TUI behavior.

## Status

Done
