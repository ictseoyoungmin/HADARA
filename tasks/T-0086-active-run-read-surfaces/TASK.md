# T-0086 Active Run Read Surfaces

## Goal

Expose the existing single active run projection through stable read-only CLI and MCP surfaces.

## Scope

- Add CLI JSON/text handling for `hadara run-state show --json`.
- Add read-only MCP tools `hadara.active.run.read` and `hadara.active.run.resume`.
- Reuse the existing active-run projection service and degraded-read behavior.
- Register the new read surfaces in tools/capability discovery.
- Update tests and protocol docs for the new read-only surfaces.

## Out of Scope

- No active-run write commands (`start`, `update`, `complete`, or `clear`).
- No queue, worker lane, scheduler, or multi-agent behavior.
- No shell execution, provider calls, dashboard live APIs, broad MCP writes, or release gates.

## Status

Done
