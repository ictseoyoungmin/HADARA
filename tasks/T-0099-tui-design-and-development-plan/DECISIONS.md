# Decisions

- Treat the future production TUI as a read-only local terminal work console, not a dashboard replacement and not a write/execution surface.
- Use the existing mockup's focused panel set as the initial product shape: Overview, Tasks, Detail, and Help.
- Prefer TypeScript plus Node standard terminal control for the first integrated TUI slice. This keeps speed, packaging, and version dependency risk low while preserving the option to adopt a framework later.
- The TUI should consume existing shared read-model services in production; the mockup's CLI subprocess adapter remains useful as a fixture/prototype compatibility path.
