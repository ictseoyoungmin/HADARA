# T-0042 Hermes/MCP Read-Only Contract

## Goal

Define the first read-only HADARA MCP bridge contract before implementing a server body.

## Scope

- Document the CLI JSON output contract, including command-specific failure envelopes and the shared early-failure fallback envelope.
- Document the read-only MCP bridge contract and tool schemas.
- Keep write tools, shell execution, provider calls, and real MCP server behavior out of scope.
- Update Hermes integration guidance and exported context guidance to point agents at the read-only MCP contract.
- Update AGENTS/SOP guidance so agents treat `AGENT_HANDOFF.md` as compact current state and follow its Historical Index for older history.

## Out of Scope

- Implementing an MCP JSON-RPC server.
- Implementing MCP tools.
- Adding write-capable task, evidence, or handoff tools.
- Running shell commands, provider calls, or dashboard work through MCP.

## Status

Done
