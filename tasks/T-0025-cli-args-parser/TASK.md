# T-0025 CLI Args Parser

## Goal

Replace ad hoc CLI option reads with strict reusable helpers so missing values and flag-like values are rejected consistently.

## Scope

- Add `src/cli/args.ts`.
- Provide string, required string, integer, and flag helpers.
- Reject missing option values.
- Reject values that look like another flag.
- Apply helpers to the current bootstrap CLI option reads.
- Preserve existing command behavior except where invalid input is now rejected earlier.

## Out of Scope

- Full command schema framework.
- Subcommand routing rewrite.
- Shell command parsing policy changes.
- Agent loop evidence attachment.

## Status

Done
