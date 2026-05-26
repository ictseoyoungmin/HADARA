# T-0111 TUI Frame Color and Viewer Parity Fix

## Goal

Fix the TUI visual parity issues reported after T-0110: frame line colors looked different from the mockup and the detail document viewer still felt like the older plain Markdown viewer.

## Scope

- Match the mockup's theme color model more closely by using 24-bit RGB ANSI sequences from the mockup palette instead of 256-color approximations.
- Keep deterministic no-color output unchanged by default.
- Preserve fixed visible terminal widths when RGB ANSI styling is enabled.
- Make the detail document viewer feel less like a legacy compatibility box by styling headings, horizontal rules, checklist markers, bullets, and numbered markers inside the viewer.
- Wire detail viewer keyboard Up/Down/PageUp/PageDown/Home/End scroll state into rendered document slices so long documents can be read inside the TUI.
- Match the mockup's compact detail document tab labels (`DEC`, `ACC`, `EVD`, `HAND`, `FILE`, `RISK`, `TEST`) instead of the longer legacy labels.
- Add regression tests for exact mockup border RGB, high-contrast border RGB, RGB status badges, and colored document viewer content.

## Out of Scope

- Mouse support, resize support, scrollbars, hitboxes, or click handling.
- A new external snapshot JSON contract.
- Any TUI write action, shell execution, provider call, MCP call, dashboard serving, or release behavior.

## Status

Done
