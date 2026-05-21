# T-0010 Harness Replay Skeleton

## Goal

Add a deterministic `hadara harness replay <scenario.jsonl> --json` skeleton using ScriptedProvider-style scenarios before ShellTool execution, full agent loop, dashboard, MCP body, or real provider adapters.

## Scope

- Define a small replay JSONL event schema for user prompts, assistant provider responses, and final expectations.
- Implement a replay runner that validates event ordering and expected final output.
- Expose `hadara harness replay <scenario.jsonl> [--json]`.
- Return a stable machine-readable JSON envelope.
- Map replay validation failures to exit code `6`.
- Keep scenario paths project-relative in output and avoid private logs.

## Out of Scope

- Real tool execution.
- File patching or shell/test command execution.
- Full golden replay acceptance matrix.
- Agent controller loop.
- Provider network adapters.

## Status

Done
