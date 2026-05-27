# Context

- User feedback: TUI only opened after loading finished; loading indicator was static when entering detail or other tabs.
- User requested this be combined with the next mouse/resize ergonomics work in one capsule.
- Reference code read: `.mockup/tui-final/src/app.js` loading timer, mouse SGR handling, and resize redraw behavior.
- Production shell remains HADARA-native over injected streams and read-only read models.
- Validation used `hadara-cli-test` Docker container with container-local `/tmp` copies due WSL/npm symlink constraints.
