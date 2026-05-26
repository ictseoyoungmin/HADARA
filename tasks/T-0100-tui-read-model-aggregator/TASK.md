# T-0100 TUI Read-Model Aggregator

## Goal

Implement the first production TUI slice: a typed read-model aggregator that composes existing HADARA read services for future terminal rendering without adding a TUI renderer, interactive shell, CLI entry point, or write behavior.

## Scope

- Add an internal `src/tui/read-model.ts` service.
- Aggregate status, task list, selected task detail, evidence, active-run projection/resume, operational debt, advisory release gate, tools list, and write-preflight preview.
- Select the active task when active-run state points to an existing task; otherwise select the latest task.
- Return issues from the underlying read models without throwing for degraded read state.
- Add focused unit tests for aggregation, selected task behavior, and no-write boundaries.
- Update T-0100 capsule, board, state, slices, and handoff.

## Out of Scope

- Terminal rendering.
- Interactive keyboard/mouse state.
- `hadara tui` CLI command.
- Snapshot renderer.
- Runtime schema registration for TUI output.
- Shell execution, provider calls, MCP calls, evidence writes, task mutation, handoff updates, release/package execution, or cache writes.

## Status

Done
