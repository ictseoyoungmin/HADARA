# Context

T-0104 completed deterministic TUI snapshot polish. The next roadmap slice is pure TUI interactive state over the polished renderer before raw terminal mode or a CLI entry point.

Relevant source and docs:

- `docs/design/TUI_DESIGN_NOTES.md`
- `docs/DEVELOPMENT_SLICES.md` slice 73g
- `src/tui/read-model.ts`
- `src/tui/snapshot.ts`
- `src/tui/constants.ts`
- `tests/unit/tui-snapshot.test.ts`
- `tests/unit/tui-read-model.test.ts`

Boundary:

- Keep the state layer internal and read-only.
- Do not add terminal raw mode, timers, cache writes, shell execution, provider calls, MCP calls, broad CLI behavior, or Task Capsule mutation.
