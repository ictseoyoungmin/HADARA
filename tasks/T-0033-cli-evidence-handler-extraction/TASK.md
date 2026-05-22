# T-0033 CLI Evidence Handler Extraction

## Goal

Continue reducing `src/cli/main.ts` density by extracting the evidence command group into a focused CLI handler module.

## Scope

- Move `hadara evidence collect` CLI handling into `src/cli/evidence.ts`.
- Preserve JSON/text output behavior and exit codes.
- Keep `main.ts` as the top-level dispatcher.
- Add or adjust tests if needed.

## Out of Scope

- Evidence store behavior changes.
- Artifact redaction policy changes.
- Full command router rewrite.
- Policy command extraction.
- MCP server implementation.

## Status

Done
