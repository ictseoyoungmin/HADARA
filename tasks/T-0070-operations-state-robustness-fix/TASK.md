# T-0070 Operations State Robustness Fix

## Goal

Harden operations read models against local state corruption and premature acceptance blind spots.

## Scope

- Make malformed active run local state degrade Operations Status JSON instead of throwing.
- Warn when an active run references a missing Task Capsule.
- Make active run tests write the actual generated task id into handoff.
- Tighten premature acceptance detection to warn on checked acceptance when status is not Done or no valid evidence records exist.
- Match shared Markdown section extraction on heading lines only.

## Out of Scope

- New CLI commands.
- MCP write tools.
- Blocking harness validation on operational debt warnings.
- Queue or multi-agent run state.

## Status

Done
