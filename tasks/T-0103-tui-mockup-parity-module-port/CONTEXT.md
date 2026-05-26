# Context

- Required protocol docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- Reference mockup: `.mockup/tui/app.js` is the visual and behavior baseline for the future production TUI.
- Existing implementation base: `src/tui/read-model.ts` and `src/tui/snapshot.ts` from T-0100/T-0102.
- This slice intentionally keeps the TUI internal and read-only. The mockup's async CLI collection, state cache, raw terminal loop, mouse handling, and refresh timers remain future work.
