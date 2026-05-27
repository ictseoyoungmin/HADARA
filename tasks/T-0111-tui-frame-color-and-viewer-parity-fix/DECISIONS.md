# Decisions

- Use the mockup's exact RGB palette with ANSI true-color sequences (`38;2`/`48;2`) instead of 256-color approximations; this keeps frame lines much closer to `.mockup/tui-final`.
- Add a combined foreground/background helper for badges and keycaps so resets do not cancel one side of the style.
- Keep no-color rendering untouched by returning plain text from theme helpers when `theme === 'none'`.
- Colorize existing detail viewer lines after Markdown rendering rather than rewriting the Markdown renderer contract in this small follow-up.
- Render the full selected document before slicing by `documentScroll`; this preserves keyboard scroll behavior without adding read effects or state mutation in the renderer.
- Use mockup short tab labels for dense detail layout while keeping file-name and key resolution unchanged.
- For TUI cache source signals, trust unchanged `mtimeMs` and `size` to reuse the cached hash during fast validation; only read and hash when those cheap metadata checks differ.
