# Handoff

## Last Completed

MCP `initialize` now reports `serverInfo.version` from HADARA package metadata instead of the stale hardcoded `0.0.0-bootstrap` string. The implementation resolves the package metadata relative to the MCP server module, so a different MCP `projectRoot` does not override the HADARA server package version. If package metadata is unreadable, initialize falls back to `unknown` rather than throwing.

Validation recorded:

- Focused Docker `npx vitest run tests/unit/mcp-server.test.ts` passed with 1 file and 7 tests.
- Docker `npm run check` passed with 57 test files and 404 tests.
- Built CLI MCP initialize smoke returned `serverInfo.version: "0.1.0-rc.0"` with read-only MCP metadata preserved.
- Done-level harness validation passed for T-0145.

## Next Recommended Step

Continue release/install work in a later capsule split by executable surface, or address any remaining metadata drift found in installed CLI/MCP smoke testing.
