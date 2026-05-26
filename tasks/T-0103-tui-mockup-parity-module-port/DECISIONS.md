# Decisions

- Port `.mockup/tui/app.js` incrementally by stable concern boundaries: constants, layout primitives, Markdown/document rendering, then snapshot frame/panels.
- Keep TypeScript + Node standard terminal rendering as the initial low-dependency path. No TUI framework is introduced in this slice; interactive framework choice stays deferred until the raw terminal/input capsule.
- Preserve the read-only boundary: no CLI entry point, subprocess refresh, state cache, shell execution, provider calls, MCP calls, or writes.
