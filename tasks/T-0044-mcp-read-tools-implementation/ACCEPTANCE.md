# Acceptance Criteria

- [x] MCP tool metadata is split out of `src/mcp/server.ts`.
- [x] `tools/call` validates `{ "name": string, "arguments": object }`.
- [x] `hadara.task.list` returns the existing task list JSON report as MCP JSON text content.
- [x] `hadara.task.read` returns Task Capsule standard files and parsed evidence index.
- [x] `hadara.handoff.read` returns compact handoff and bounded optional history.
- [x] `hadara.project.state.read` returns project state, task board, and development slices with sizing options.
- [x] `hadara.policy.evaluate` evaluates policy preflight without executing commands.
- [x] `hadara.harness.validate` validates a Task Capsule without mutating it.
- [x] JSON-RPC notifications produce no response.
- [x] Dispatch errors include HADARA issue codes for `TOOL_NOT_FOUND`, `TOOL_INPUT_INVALID`, `TOOL_NOT_IMPLEMENTED`, and `TOOL_FORBIDDEN_BY_PHASE`.
- [x] No write tools, shell execution, provider calls, or mutations are added.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
