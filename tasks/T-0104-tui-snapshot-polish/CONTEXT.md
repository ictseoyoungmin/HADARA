# Context

- Required protocol docs read in the active working sequence: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- T-0103 introduced the mockup-derived `src/tui/constants.ts`, `src/tui/layout.ts`, `src/tui/markdown.ts`, and mockup-style `src/tui/snapshot.ts`.
- This polish slice is still internal and read-only; no raw terminal loop, CLI command, persistent cache, subprocess refresh, MCP call, provider call, shell execution, or project mutation is introduced.
