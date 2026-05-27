# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/constants.ts` | Modify | Share Tasks/Detail height policy helpers across renderer and terminal state. |
| `src/tui/markdown.ts` | Modify | Parse evidence Markdown rows for mockup-style Proof fallbacks. |
| `src/tui/snapshot.ts` | Modify | Align Tasks height, Overview Resume Signals, and Work-card `Next`/`Proof` rendering. |
| `src/tui/terminal.ts` | Modify | Keep task cursor/page movement aligned with renderer-derived visible rows. |
| `tests/unit/tui-snapshot.test.ts` | Modify | Cover Overview copy parity and Tasks height consistency. |
| `tests/unit/tui-state.test.ts` | Modify | Cover height-derived task window behavior. |
| `tests/unit/tui-terminal.test.ts` | Modify | Cover terminal-level task window alignment if needed. |
