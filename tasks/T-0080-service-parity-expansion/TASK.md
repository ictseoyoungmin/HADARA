# T-0080 Service Parity Expansion

## Goal

Expand CLI/MCP service parity by moving Task Capsule read-model logic into a shared service boundary.

## Scope

- Add a shared task read-model service for task list/show/read reports.
- Keep existing CLI task JSON behavior compatible through the previous `src/cli/task-json.ts` import path.
- Route read-only MCP `hadara.task.list` and `hadara.task.read` through the shared task service.
- Add contract coverage proving MCP task read/list payloads are produced by the shared service.

## Out of Scope

- No new task write behavior beyond the existing `hadara task create` command.
- No broad MCP writes, shell execution, provider calls, dashboard APIs, or schema runtime validation.
- No changes to task storage format.

## Status

Done
