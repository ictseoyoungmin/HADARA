# T-0104 TUI Snapshot Polish

## Goal

Harden the TUI snapshot renderer before interactive state work by improving deterministic snapshot output, terminal width semantics, and wide-character Markdown rendering.

## Scope

- Make snapshot output deterministic by hiding volatile generated timestamps by default.
- Add an explicit snapshot width policy: mockup mode clamps to the mockup minimum frame, compact mode supports smaller terminals.
- Update Markdown wrapping and table rendering to use visible terminal width rather than raw string length.
- Cover Korean/wide-character snapshot and Markdown regressions.
- Keep the TUI read-only.

## Out of Scope

- Interactive keyboard input.
- Mouse support.
- `hadara tui` command.
- Color theme runtime.
- Persistent TUI cache.
- Raw terminal mode, CLI entry point, cache writes, shell execution, provider calls, MCP calls, evidence writes, task mutation, release execution, or handoff mutation.

## Status

Done
