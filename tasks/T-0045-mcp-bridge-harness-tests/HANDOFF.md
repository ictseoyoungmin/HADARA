# Handoff

## Last Completed

- Added MCP bridge contract tests in `tests/contract/mcp-bridge-contract.test.ts`.
- Contract tests require one JSON text content item for MCP tool results.
- Compared `hadara.task.list`, `hadara.policy.evaluate`, and `hadara.harness.validate` payloads to existing report builders.
- Covered bridge-specific `task.read`, `handoff.read`, and `project.state.read` shapes.
- Covered JSON-RPC notification no-response behavior and dispatch issue-code mapping.
- Docker `npm ci && npm run check` passed with 25 test files and 128 tests.
- Docker built CLI `harness validate --task T-0045 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with T-0046 Evidence Attach Tool Contract. Keep it contract-only and do not add write-capable MCP behavior until the contract is accepted.
