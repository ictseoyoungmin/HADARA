# Acceptance Criteria

- [x] MCP tool result payload tests require exactly one JSON text content item.
- [x] `hadara.task.list` MCP payload matches the task list report builder.
- [x] `hadara.policy.evaluate` MCP payload matches policy preflight output.
- [x] `hadara.harness.validate` MCP payload matches harness validation output.
- [x] `hadara.task.read`, `hadara.handoff.read`, and `hadara.project.state.read` contract shapes are covered.
- [x] JSON-RPC notifications are covered as no-response messages.
- [x] Dispatch error mapping covers `TOOL_NOT_FOUND` and `TOOL_INPUT_INVALID`.
- [x] Tests do not execute shell commands, call providers, or mutate project files through MCP.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
