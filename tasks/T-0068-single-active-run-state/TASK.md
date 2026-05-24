# T-0068 Single Active Run State

## Goal

Track the current task/run without queue or multi-agent assumptions.

## Scope

- Add a single active run manifest format under local project state.
- Add a read projection with resume guidance.
- Detect stale handoff when the active task is not mentioned in `docs/AGENT_HANDOFF.md`.
- Surface the active run projection in Operations Status JSON.

## Out of Scope

- Queue management.
- Multi-agent concurrent execution.
- MCP write tools.
- Shell execution.
- Provider calls.
- Real run orchestration.

## Status

Done
