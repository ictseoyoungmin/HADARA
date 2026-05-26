# T-0103 TUI Mockup Parity Module Port

## Goal

Port the first reusable pieces of `.mockup/tui/app.js` into production TypeScript modules under `src/tui` so the internal snapshot renderer moves toward mockup parity instead of remaining a minimal placeholder.

## Scope

- Add TUI constants for panels and Task Capsule document tabs.
- Add reusable terminal layout helpers for fixed-width frames, cards, badges, columns, dividers, and clipping.
- Add a Markdown-to-terminal document renderer for headings, checklists, bullets, and tables.
- Update the internal snapshot renderer to use the mockup-style Work Console frame, side/tab navigation, overview cards, task list rows, detail document viewer, and help controls.
- Keep the implementation internal and read-only.

## Out of Scope

- Raw terminal mode, keyboard/mouse input, async refresh, cache/state files, CLI entry point, shell execution, provider calls, MCP calls, and writes.

## Status

Done
