# Context

Relevant documents, files, assumptions, and constraints.

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `tasks/T-0106-tui-raw-terminal-shell/TASK.md`
- `tasks/T-0106-tui-raw-terminal-shell/HANDOFF.md`

## Working Context

- T-0106 completed the internal injected-stream terminal shell in `src/tui/terminal.ts`.
- The next recommended TUI step is a separate public CLI entry-point capsule.
- Host Node/npm is unreliable in this WSL environment; Docker is the validation path.
- Public TUI behavior must remain read-only and local: no shell execution, provider calls, MCP calls, evidence writes, handoff writes, task mutation, cache writes, or server behavior.
