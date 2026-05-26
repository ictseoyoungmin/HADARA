# Decisions

- Production interactive TUI defaults to the HADARA color theme; snapshot mode remains no-color unless `--color` is requested, preserving deterministic smoke output.
- Color rendering is implemented with small ANSI 256-color helpers and visible-width-safe padding/trimming rather than adding a runtime TUI dependency.
- Refresh and detail-refresh now draw a synchronous loading frame before reloading the read model, which makes slow reads visible without adding async runtime complexity.
- CLI snapshot JSON keeps the existing `hadara.tui.snapshot.cli.v1` compatibility envelope; internal snapshot metadata now exposes `terminal.color` and `terminal.theme`.
- Task row rendering now accepts interaction state for selected task and task search so keyboard navigation visibly changes the screen before detail reload.
