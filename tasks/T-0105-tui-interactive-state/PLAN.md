# Plan

1. Read required HADARA docs and TUI design/state context.
2. Define the T-0105 capsule scope around pure TUI interaction state only.
3. Add `src/tui/state.ts` with deterministic state initialization and key transition helpers.
4. Add focused unit tests for panel switching, task selection/search, document tabs, scroll, refresh/quit, and read-only behavior.
5. Run focused TUI tests and broader Docker validation as feasible.
6. Attach evidence, update tracked docs, and refresh handoff.
