# Plan

1. Read required HADARA docs plus TUI design/read-model/snapshot/state context.
2. Define T-0106 around an internal raw-terminal shell only, without a public CLI entry point.
3. Add `src/tui/terminal.ts` with key decoding, injected terminal IO, redraw, refresh/detail-refresh handling, and clean shutdown.
4. Add focused unit tests for decoded keys, redraw/refresh effects, raw-mode restoration, quit handling, and no project writes.
5. Run focused TUI tests and full Docker validation as feasible.
6. Attach evidence, update tracked docs, and refresh handoff.
