# Handoff

## Last Completed

T-0106 TUI Raw Terminal Shell is complete. `src/tui/terminal.ts` adds an internal raw-terminal shell over the existing read model, snapshot renderer, and interaction state, with key decoding, injected input/output streams, redraw handling, refresh/detail-refresh effects, and clean shutdown. It remains read-only and internal with no public `hadara tui` command, cache writes, shell execution, provider calls, MCP calls, evidence writes, handoff updates, or Task Capsule mutation.

## Next Recommended Step

If continuing TUI work, add a separate public CLI entry-point capsule that wires the internal terminal shell into an explicitly documented command boundary. Otherwise continue with the release and packaging track from `docs/DEVELOPMENT_SLICES.md`.
