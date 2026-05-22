# T-0035 CLI Hermes and Handoff Handler Extraction

## Goal

Continue reducing `src/cli/main.ts` density by extracting the Hermes and handoff command groups into focused CLI handler modules.

## Scope

- Move `hadara hermes detect` and `hadara hermes export-context` CLI handling into `src/cli/hermes.ts`.
- Move `hadara handoff update` CLI handling into `src/cli/handoff.ts`.
- Preserve JSON/text output behavior and exit codes.
- Keep `main.ts` as the top-level dispatcher.
- Add or adjust tests if needed.

## Out of Scope

- Hermes context export behavior changes.
- Handoff document generation behavior changes.
- MCP server implementation.
- Full command router rewrite.

## Status

Done
