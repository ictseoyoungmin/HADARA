# T-0021 Agent Loop Minimal Harness

## Goal

Add a minimal deterministic agent loop harness that combines ScriptedProvider responses with fake shell tool observations.

## Scope

- Implement a bounded loop that sends task/user context to ScriptedProvider.
- Execute explicit fake shell tool requests through policy-gated fake shell fixtures.
- Add JSON result shape for loop steps, final response, and issues.
- Expose the loop through `hadara run` for deterministic local/CI smoke use.
- Add tests, evidence, and handoff updates.

## Out of Scope

- Real provider adapters.
- Real shell execution.
- Interactive approval UI.
- Autonomous file editing.
- Dashboard or MCP server body.

## Status

Done
