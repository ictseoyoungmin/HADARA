# Context

- Required project docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/DEVELOPMENT_SLICES.md`.
- TUI planning docs read: `docs/design/TUI_DESIGN_NOTES.md`, `docs/V1_0_CAPSULE_BACKLOG.md`, `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`.
- Mockup code read directly before implementation: `.mockup/tui/app.js`, `.mockup/tui-final/src/app.js`, `.mockup/tui-final/README.md`.
- Production TUI remains HADARA-native TypeScript over shared read models and local terminal rendering. No new runtime dependency was added.
- Host WSL has no usable Linux Node binary; validation used the reusable Docker container with a container-local `/tmp` repo copy because `/workspace` cannot create npm symlinks reliably.
