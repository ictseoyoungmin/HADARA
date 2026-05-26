# Decisions

Record task-local design decisions here.

- Keep the raw terminal shell internal in `src/tui/terminal.ts`; do not add a public `hadara tui` CLI command in this capsule.
- Use Node standard streams and terminal control instead of adding a TUI framework dependency.
- Accept injected input/output streams so tests can prove behavior without real terminal raw mode.
- Reuse `createTuiReadModel`, `renderTuiSnapshot`, and `reduceTuiInteractionState` rather than adding separate data or rendering paths.
- Treat refresh and detail refresh as local effects handled by recreating the read model, then clearing state flags through the T-0105 completion actions.
