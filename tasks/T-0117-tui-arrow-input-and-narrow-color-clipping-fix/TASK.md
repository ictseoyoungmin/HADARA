# T-0117 TUI Arrow Input and Narrow Color Clipping Fix

## Goal

Fix production TUI keyboard arrow handling and narrow-width color clipping regressions reported after T-0116.

## Scope

- Diagnose why Up/Down keyboard input works in the mockup but can fail in production terminals.
- Add production support for common application-cursor and modifier arrow escape sequences.
- Clamp Detail document scroll at the renderer-derived bottom so repeated Down at EOF does not accumulate hidden scroll debt before Up responds.
- Preserve ANSI colors when colored TUI text is clipped to narrower terminal widths.
- Add focused regressions for input decoding, bounded document scrolling, and ANSI-aware fitting.

## Out of Scope

- TUI visual redesign.
- New write behavior, shell execution, provider calls, MCP calls, dashboard/server behavior, or release/package execution.
- Changing public CLI/MCP JSON contracts.

## Status

Done
