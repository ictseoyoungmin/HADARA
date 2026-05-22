# T-0031 CLI Handler Extraction

## Goal

Reduce `src/cli/main.ts` density by extracting recently added command helper logic into focused CLI modules.

## Scope

- Move init profile/project initialization logic into `src/cli/init.ts`.
- Move run scenario scaffold logic into `src/cli/run-scaffold.ts`.
- Keep CLI behavior and JSON envelopes stable.
- Update imports/tests to use the focused modules where appropriate.

## Out of Scope

- Full command router rewrite.
- Moving every command handler out of `main.ts`.
- Changing command behavior or output schemas.

## Status

Done
