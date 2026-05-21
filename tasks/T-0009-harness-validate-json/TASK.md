# T-0009 Harness Validate JSON

## Goal

Stabilize a deterministic `hadara harness validate --task <id> --json` command before full replay, ShellTool execution, dashboard, MCP, or real provider adapters.

## Scope

- Validate Task Capsule structure for required protocol files.
- Validate basic `EVIDENCE.md` table shape and `evidence.jsonl` parseability when present.
- Return a stable machine-readable JSON envelope for success and failure.
- Use exit code `6` for Task Capsule/schema validation failures.
- Keep work inside the project repo and avoid private logs or machine-local paths.

## Out of Scope

- Full golden replay execution.
- ShellTool execution.
- Real provider adapters.
- Dashboard and MCP implementation.
- Encrypted/private evidence artifact storage.

## Status

Done
