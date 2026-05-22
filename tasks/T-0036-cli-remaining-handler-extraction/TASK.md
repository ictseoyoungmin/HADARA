# T-0036 CLI Remaining Handler Extraction

## Goal

Finish the current CLI handler extraction pass by moving the remaining command groups out of `src/cli/main.ts`.

## Scope

- Move `init`, `doctor`, `task`, `mcp`, and `run` CLI handling into focused modules.
- Preserve JSON/text output behavior and exit codes.
- Keep `main.ts` as the top-level dispatcher and help entrypoint.
- Update tests that import run CLI helpers.

## Out of Scope

- Agent loop behavior changes.
- Task Capsule behavior changes.
- Doctor report behavior changes.
- MCP server implementation.
- Full command router rewrite.

## Status

Done
