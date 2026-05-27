# Files

| Path | Action | Reason |
|---|---|---|
| `src/tui/terminal.ts` | Modify | Decode application-cursor and modifier arrow escape sequences. |
| `src/tui/layout.ts` | Modify | Preserve ANSI escape sequences while clipping colored text to narrow widths. |
| `src/tui/snapshot.ts` | Modify | Expose renderer-derived Detail document scroll bounds for the terminal reducer path. |
| `src/tui/state.ts` | Modify | Clamp Detail document scroll when a rendered max scroll is available. |
| `tests/unit/tui-terminal.test.ts` | Modify | Cover additional arrow escape sequence variants and terminal-level bounded document scrolling. |
| `tests/unit/tui-state.test.ts` | Modify | Cover reducer-level document scroll clamping. |
| `tests/unit/tui-layout.test.ts` | Add | Cover ANSI-aware fitting in narrow widths. |
