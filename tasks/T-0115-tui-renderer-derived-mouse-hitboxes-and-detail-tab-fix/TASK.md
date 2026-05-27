# T-0115 TUI Renderer-Derived Mouse Hitboxes and Detail Tab Fix

## Goal

Make production TUI mouse handling derive click targets from the renderer output, matching the mockup hitbox model while preserving the existing visual surface.

## Scope

- Add internal renderer-derived hitboxes for panel navigation, task rows, and Detail document tabs.
- Route terminal SGR mouse clicks through those hitboxes instead of duplicated fixed coordinate geometry.
- Fix Detail tab click targeting so compact and wide layouts follow the actually rendered tab positions.
- Preserve the read-only TUI boundary and keep user-visible layout/text unchanged except for small interaction correctness improvements.

## Out of Scope

- TUI task/evidence/handoff writes.
- Shell execution, provider calls, MCP calls, dashboard/server behavior, or release/package behavior.
- A worker-thread async loader or broader rendering redesign.
- Visual redesign away from the mockup baseline.

## Status

Done
