# Context

- User feedback after T-0110: frame line color did not look like the mockup, and the viewer felt like a backward-compatible/legacy detail box.
- Mockup code re-read: `.mockup/tui-final/src/app.js` theme palette, `ansiFg`/`ansiBg`, `card()`, and detail viewer rendering.
- The mockup uses hex RGB colors (`#34434A` border for HADARA, `#777777` for contrast), so production now uses true-color ANSI rather than 256-color approximations.
- Work remains read-only and local TUI-only; no write/shell/provider/MCP behavior was added.
