# Context

The user asked not to start implementation yet because the TUI must be included consistently in docs first. The current mockup is `.mockup/tui/app.js`; `.mockup/tui-final/src/app.js` is a polished focused variant with Overview, Tasks, Detail, and Help panels.

Relevant constraints:

- HADARA work must stay inside one Task Capsule.
- TUI must preserve the read-only operations boundary until a later capsule explicitly expands scope.
- Existing read models and CLI JSON surfaces are the source of truth.
- Dashboard and TUI should share product boundaries but remain separate surfaces: browser dashboard for visual operations home, terminal TUI for local operator work console.
- Host Node/npm is unreliable; Docker remains the validation path when Node-based checks are needed.
