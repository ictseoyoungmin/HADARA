# Handoff

## Last Completed

- Added read-only CLI `hadara run-state show --json` for `hadara.active_run.projection.v1`.
- Added read-only CLI `hadara run-state resume --json` for derived `hadara.active_run.resume.v1` guidance.
- Added read-only MCP tools `hadara.active.run.read` and `hadara.active.run.resume`.
- Registered the new active-run read surfaces in tools/capability discovery.
- Updated CLI JSON and MCP bridge contracts for the new read surfaces.
- Validation passed in Docker:
  - `npx vitest run tests/unit/active-run-state.test.ts tests/unit/mcp-tools.test.ts tests/unit/tools-list.test.ts tests/contract/mcp-bridge-contract.test.ts`
  - `npm run check`
  - Built CLI smokes for `run-state show --json` and `run-state resume --json`
  - `node dist/cli/main.js harness validate --task T-0086 --level done --json --project /workspace`

## Next Recommended Step

Continue with Operational Debt Release Gates or the next evidence/security observability slice. Keep active-run write commands, broad MCP writes, shell execution, provider calls, and live dashboard APIs deferred.
