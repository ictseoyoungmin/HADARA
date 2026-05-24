# T-0081 Policy Service Parity

## Goal

Continue Service Parity Expansion by routing policy evaluation report creation through a named shared service.

## Scope

- Add `src/services/policy-service.ts` for policy check and policy evaluate/preflight report builders.
- Keep existing CLI policy JSON imports compatible through `src/cli/policy-json.ts`.
- Route CLI `policy preflight-shell` and read-only MCP `hadara.policy.evaluate` through the shared policy service.
- Update service parity coverage so MCP policy evaluate is compared against the shared service.

## Out of Scope

- No policy matrix refactor or new permission modes.
- No shell execution, provider calls, MCP writes, or dashboard APIs.
- No schema runtime validation or release-gate behavior.

## Status

Done
