# T-0072 Core v1.0 Technical Plan Refresh

## Goal

Refresh the v1.0 planning documents so the T-0066 through T-0070 implementation/design mismatch is explicit and future work builds on the actual implemented boundaries.

## Scope

- Clarify the T-0066 compatibility fixture as a contract-test fixture, not a product compatibility module.
- Clarify the T-0067 service parity refactor as partial, with project/handoff reads shared and broader services deferred.
- Clarify the T-0068 active-run canonical local path and snake_case schema names.
- Clarify the T-0069 operational debt implementation as static records/reporting, with future persistence still undecided.
- Clarify the T-0070 degraded-read robustness rule as completed for active-run/status debt checks and future-facing for new read APIs.

## Out of Scope

- Implementing any new runtime, MCP, dashboard, provider, run-state, or debt CLI behavior.
- Creating real provider adapters or broad write-capable MCP tools.
- Changing committed code or tests except for documentation validation needs.

## Status

Done
