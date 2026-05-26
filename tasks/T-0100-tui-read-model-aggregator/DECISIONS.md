# Decisions

- Add `src/tui/read-model.ts` as an internal service instead of a CLI command.
- Use direct TypeScript read-model services instead of spawning `hadara ... --json`.
- Include `hadara write preflight task create "TUI Follow-up"` as a read-only preview so future UI can show expected write boundaries without executing writes.
- Keep TUI output unregistered as a public schema for this slice.
