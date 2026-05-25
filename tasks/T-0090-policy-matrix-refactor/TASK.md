# T-0090 Policy Matrix Refactor

## Goal

Refactor shell policy evaluation into explicit tokenizer, command-risk, safe-preset, and permission-matrix modules while preserving existing CLI/MCP/fake-shell behavior.

## Scope

- Move shell tokenization out of `src/policy/policy.ts`.
- Move known safe command definitions into a preset module with explicit risk categories.
- Add a command-risk classifier for read/test/build/write/network/destructive/release cases.
- Add a permission matrix that maps permission mode plus command risk to the existing allow/ask/deny decisions.
- Keep existing public imports from `src/policy/policy.ts` compatible.
- Add policy matrix regression tests for the major command-risk categories.

## Out of Scope

- Actor/surface-aware provider authorization.
- Structured policy audit events.
- CLI `--` delimiter parsing changes.
- Real shell execution or provider calls.
- MCP write/execution tools.

## Status

Done
