# T-0114 TUI Mockup UX Parity Audit Fix

## Goal

Close the highest-impact TUI mockup UX parity gaps found after T-0113 before moving to deeper async/worker loading work.

## Scope

- Make fast-profile deferred advisory reads visible in the Overview instead of showing misleading zero/ok debt and release signals.
- Wire task-list scroll/search activity state into snapshot rendering so keyboard-selected rows and rendered rows stay aligned.
- Make task row mouse clicks behave like the mockup by opening Detail and refreshing the selected task detail.
- Prevent wide task-table clicks from being mistaken for left navigation clicks.
- Add focused regression coverage for the above behavior.

## Out of Scope

- Worker-thread loader or full async read-model migration.
- TUI write actions, shell execution, provider calls, MCP calls, dashboard/server behavior, release/package behavior.
- A full renderer-derived hitbox system; this capsule only aligns the existing fixed mouse geometry with rendered task windows.

## Status

Done
