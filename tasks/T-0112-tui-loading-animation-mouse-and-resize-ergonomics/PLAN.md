# Plan

1. Re-read the production TUI terminal shell and `.mockup/tui-final` mouse/resize/loading behavior.
2. Add a loading read model so startup can render before the full read model is available.
3. Refactor terminal session startup to render loading frames before initial load.
4. Render multiple loading ticks before detail/full refresh loads.
5. Add SGR mouse enable/disable, decode, and click handling for panel/task/doc-tab actions.
6. Add resize redraw handling.
7. Add focused terminal regressions and run full Docker validation.
8. Record evidence and update handoff/state docs.
