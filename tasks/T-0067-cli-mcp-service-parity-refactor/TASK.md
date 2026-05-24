# T-0067 CLI/MCP Service Parity Refactor

## Goal

Move duplicated CLI/MCP read logic into shared services and read models.

## Scope

- Add a shared project/handoff read-model service.
- Use the shared service from Operations Status JSON document reads and MCP project/handoff tools.
- Add parity coverage proving MCP payloads match shared read-model and CLI/domain report builders.

## Out of Scope

- New MCP tools.
- MCP write tools.
- Shell execution.
- Provider calls.
- Live dashboard integration.
- Multi-agent run state.

## Status

Done
