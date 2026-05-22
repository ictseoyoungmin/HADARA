# T-0019 Shell Preflight Harness

## Goal

Add a deterministic fake shell harness that connects policy preflight to tool-style execution results before any real shell execution exists.

## Scope

- Add a fake shell harness module.
- Gate every fake command through `createShellExecutionPreflight`.
- Return configured fake results only when preflight allows execution.
- Return structured blocked observations for approval-required and denied commands.
- Add unit tests for allowed, approval-required, denied, and missing fake command paths.

## Out of Scope

- Real shell execution.
- `child_process` usage.
- Interactive approval flow.
- Full agent controller loop.
- Dashboard, MCP server body, and real provider adapters.

## Status

Done
