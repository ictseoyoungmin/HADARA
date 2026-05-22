# T-0032 CLI Harness Handler Extraction

## Goal

Continue reducing `src/cli/main.ts` density by extracting the harness command group into a focused CLI handler module.

## Scope

- Move `hadara harness validate` and `hadara harness replay` CLI handling into `src/cli/harness.ts`.
- Preserve JSON/text output behavior and exit codes.
- Keep `main.ts` as the top-level dispatcher.
- Add or adjust tests if needed.

## Out of Scope

- Full command router rewrite.
- Harness validation behavior changes.
- Harness replay schema changes.
- MCP server implementation.

## Status

Done
