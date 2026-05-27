# T-0118 TUI Tasks Height and Overview Copy Parity

## Goal

Close the latest production TUI parity gaps against `.mockup/tui-final`: Tasks panel height, simplified Overview Resume Signals, and Current/Previous Work `Next`/`Proof` text selection.

## Scope

- Make Tasks panel visible row count derive from the same available-height policy as Detail so the panels occupy consistent vertical space.
- Simplify Overview Resume Signals to the mockup-style health/tasks and validation lines.
- Align Overview Current Work / Previous Work `Next` and `Proof` fallback order with the mockup while keeping production read-model-first behavior.
- Preserve numeric `1`/`2`/`3`/`4` as search text while Tasks search mode is active.
- Add focused snapshot/state/terminal regressions for the rendering and cursor-window behavior affected by the height policy.

## Out of Scope

- TUI writes, shell execution, provider calls, MCP behavior, dashboard behavior, release/package behavior, or read-model contract changes.
- Visual redesign beyond the requested mockup parity adjustments.
- Reading task Markdown directly in the renderer outside the existing read-model detail surfaces.

## Status

Done
