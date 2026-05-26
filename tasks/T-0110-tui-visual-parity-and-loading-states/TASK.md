# T-0110 TUI Visual Parity and Loading States

## Goal

Bring the production read-only TUI closer to `.mockup/tui-final` by applying the mockup visual language, keyboard ergonomics, and visible loading frames to the existing HADARA-native renderer and terminal shell.

## Scope

- Add explicit TUI themes for default HADARA color, high contrast color, and deterministic no-color rendering.
- Preserve no-color snapshots as the default for snapshot smoke tests while allowing explicit color snapshots.
- Add status/log-line rendering and loading frames for full/detail refreshes.
- Polish overview cards, task rows, detail document tabs, status badges, and help/status control text.
- Make mockup-style keys work in production paths: Tab, Shift-Tab, Left/Right panel switching, Home/End, search Enter completion, and Korean keyboard quit (`ㅂ`).
- Ensure task selection/search state is reflected in rendered task rows.
- Keep the TUI read-only: no task/evidence/handoff writes, shell execution, provider calls, MCP calls, dashboard serving, or release behavior.

## Out of Scope

- Mouse hitboxes and resize redraw support; this remains a later TUI ergonomics slice.
- A new external stable snapshot JSON contract; CLI JSON remains compatible with the existing snapshot envelope while internal snapshot metadata now records color/theme state.
- TUI write actions, provider execution, shell execution, MCP calls, or live dashboard behavior.

## Status

Done
