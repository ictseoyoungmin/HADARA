# Plan

1. Re-check `.mockup/tui-final/src/app.js` for exact theme palette and card/viewer rendering.
2. Replace production TUI theme ANSI 256-color approximation with mockup-matching 24-bit RGB ANSI helpers.
3. Fix status/key badge styling so foreground and background compose like the mockup.
4. Colorize detail viewer document content for headings, checks, bullets, numbers, and rules.
5. Connect document scroll state to snapshot rendering and match mockup compact tab labels.
6. Optimize unchanged source signal validation by reusing cached hashes after `mtimeMs`/`size` comparison.
7. Add focused tests for frame color, viewer styling, document scrolling, tab labels, and source-signal hash reuse.
8. Run focused TUI/cache tests and full Docker validation.
9. Record evidence and update handoff/state docs.
