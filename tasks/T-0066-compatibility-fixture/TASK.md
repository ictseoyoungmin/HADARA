# T-0066 Compatibility Fixture

## Goal

Prove a Hermes-like external agent can follow exported HADARA guidance through read-only MCP/CLI JSON surfaces.

## Scope

- Add a compatibility fixture that describes the read-only external-agent flow.
- Add contract coverage that replays the fixture through context export and MCP read tools.
- Confirm the fixture does not rely on MCP write, file-write, shell execution, task mutation, or release/package tools.

## Out of Scope

- New MCP tools.
- MCP write behavior.
- Shell execution.
- Provider calls.
- Live dashboard integration.
- Multi-agent concurrency.

## Status

Done
