# Handoff

## Last Completed

- Added `docs/CLI_JSON_CONTRACT.md` to document command-specific JSON failures and `hadara.cli.error.v1` early fallback behavior.
- Added `docs/MCP_BRIDGE_CONTRACT.md` defining the read-only first MCP tool surface.
- Updated Hermes integration, exported context guidance, AGENTS, SOP, and MCP placeholder text to align with the read-only contract.
- Reopened the T-0042 capsule for follow-up review feedback covering MCP JSON text payload wrapping, task status in task JSON summaries, evidence index exposure, bounded history reads, and project-state sizing flags.
- Docker `npm ci && npm run check` passed after follow-up changes with 22 test files and 109 tests.
- Docker built CLI `harness validate --task T-0042 --level done --json` returned `ok: true` after follow-up changes.

## Next Recommended Step

Continue with T-0043 MCP JSON-RPC Server Skeleton. Keep it stdio/read-only with no file writes, shell execution, provider calls, or write-capable tools.
