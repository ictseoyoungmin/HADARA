# T-0034 CLI Policy Handler Extraction

## Goal

Continue reducing `src/cli/main.ts` density by extracting the policy command group into a focused CLI handler module.

## Scope

- Move `hadara policy check-shell` and `hadara policy preflight-shell` CLI handling into `src/cli/policy.ts`.
- Preserve JSON/text output behavior and exit codes.
- Keep `main.ts` as the top-level dispatcher.
- Add or adjust tests if needed.

## Out of Scope

- Policy evaluator behavior changes.
- Shell parser behavior changes.
- Policy preflight semantics changes.
- Full command router rewrite.
- MCP server implementation.

## Status

Done
