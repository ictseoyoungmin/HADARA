# T-0107 TUI Public CLI Entry Point

## Goal

Expose the existing internal read-only TUI terminal shell through a public `hadara tui` CLI command while preserving the current no-write, no-shell-execution, no-provider, and no-MCP-call boundaries.

## Scope

- Add a focused CLI handler for `hadara tui`.
- Wire `hadara tui` to `src/tui/terminal.ts` for interactive terminal sessions.
- Add `hadara tui --snapshot` as a non-interactive smoke path that renders one read-only frame and exits.
- Support basic terminal sizing flags for testability and operator control.
- Register the command in CLI help and capability discovery.
- Add focused unit coverage for snapshot output, JSON snapshot smoke, interactive injected-stream startup/quit, and non-interactive refusal.

## Out of Scope

- TUI writes, task mutation, evidence mutation, handoff updates, cache/persistence, or browser state.
- Shell execution, provider calls, MCP calls, dashboard server behavior, release/package behavior, or agent-controller behavior.
- Color/theme styling, mouse handling, terminal persistence, or configuration files.
- Broad schema/public API stabilization for the internal snapshot renderer.

## Status

Done
