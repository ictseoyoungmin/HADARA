# Decisions

Record task-local design decisions here.

## Public Command Shape

- Add `hadara tui` as the public interactive entry point.
- Add `hadara tui --snapshot` for non-interactive smoke checks and CI-friendly validation.
- Support `--compact`, `--width <n>`, and `--height <n>` by passing sizing options to the existing snapshot/terminal renderer.

## Boundary

- Refuse non-interactive `hadara tui` by default and point callers to `--snapshot`, preventing a piped command from hanging.
- Keep the TUI command read-only by routing through the existing read-model/snapshot/terminal modules only.
