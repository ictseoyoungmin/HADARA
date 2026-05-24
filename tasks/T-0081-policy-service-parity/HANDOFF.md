# Handoff

## Last Completed

- Added `src/services/policy-service.ts` with shared policy check and policy evaluate/preflight report builders.
- Kept `src/cli/policy-json.ts` as the compatibility facade for existing CLI policy JSON imports.
- Routed CLI `policy preflight-shell` and MCP `hadara.policy.evaluate` through the shared policy service.
- Updated service parity tests so MCP policy evaluate is compared against `createPolicyEvaluateReport`.
- Validation passed in Docker:
  - `npx vitest run tests/contract/cli-mcp-service-parity.test.ts tests/unit/policy-json.test.ts tests/unit/policy-preflight.test.ts tests/unit/mcp-tools.test.ts`
  - `npm run check`
  - `node dist/cli/main.js harness validate --task T-0081 --level done --json --project /workspace`

## Next Recommended Step

Continue Service Parity Expansion in a new focused capsule by moving harness validate or operations status behind a named shared service while preserving CLI and MCP transport envelopes.
