# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement `context pack` in the existing `src/cli/context.ts` handler. | Accepted | Keeps context routing commands together and reuses `context graph` dispatch behavior. | `src/cli/context.ts`. |
| D-2 | Map `--budget` to `ContextBudget.targetTokens`, with separate `--max-items` and `--max-read-first` caps. | Accepted | The C3 spec uses `--budget 8000`, while the T-0361 builder already supports explicit bounded item counts. | `src/cli/context.ts`, CLI tests. |
| D-3 | Keep C4 and C6 as metadata/compatibility boundaries only. | Accepted | This task exposes context pack; it must not implement raw slicing or persistent cache writes. | `docs/COMMAND_SURFACE.md`, `docs/CLI_JSON_CONTRACT.md`. |
