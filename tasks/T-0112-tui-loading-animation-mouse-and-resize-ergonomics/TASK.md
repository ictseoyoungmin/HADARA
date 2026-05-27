# T-0112 TUI Loading Animation Mouse and Resize Ergonomics

## Goal

Improve interactive TUI ergonomics so the screen opens immediately with a loading frame, refresh/detail loading shows visible animation frames, and terminal mouse/resize actions work without adding writes or shell/provider/MCP behavior.

## Scope

- Render a loading TUI frame before the initial read-model load instead of blocking on read-model construction before the first screen appears.
- Use a lightweight loading read model for initial startup frames.
- Render multiple loading ticks before initial, full, and detail refresh loads so the loading indicator visibly advances.
- Enable SGR mouse mode in interactive terminal sessions and disable it on clean shutdown.
- Decode SGR mouse clicks and support panel clicks, task row selection clicks, and detail document-tab clicks.
- Redraw on terminal resize events.
- Add focused terminal tests for initial loading, loading ticks, mouse decoding/click handling, resize redraw, and mouse cleanup.

## Out of Scope

- Persistent mouse hitbox state in snapshot JSON.
- Scrollbar rendering, drag scrolling, wheel scrolling, or terminal-specific mouse protocol expansion beyond basic SGR left-click handling.
- Async worker-thread read-model loading; current implementation makes loading visible and advances frames before synchronous reads.
- Any TUI write action, shell execution, provider call, MCP call, dashboard serving, or release behavior.

## Status

Done
