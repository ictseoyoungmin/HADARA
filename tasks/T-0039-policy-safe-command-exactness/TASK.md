# T-0039 Policy Safe Command Exactness

## Goal

Tighten safe shell command classification so safe commands require exact token matches instead of prefix matches.

## Scope

- Require safe command token arrays to match command tokens exactly.
- Preserve operator rejection.
- Add tests for safe commands with unsafe suffixes.
- Add built CLI smoke for suffixed commands.

## Out of Scope

- Per-command suffix allow rules.
- New safe command entries.
- Real shell execution.

## Status

Done
