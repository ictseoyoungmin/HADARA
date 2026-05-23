# Handoff

## Last Completed

- Added opt-in `hadara.evidence.attach` MCP metadata and registry handling.
- Added `hadara mcp serve --enable-evidence-attach`.
- Routed MCP evidence attach through `createEvidenceCollectReport` so existing task lookup, workspace boundary, artifact policy, and JSON report shape are reused.
- Preserved default runtime behavior: evidence attach is not advertised and calls return `TOOL_NOT_FOUND` unless explicitly enabled.
- Docker `npm ci && npm run check` passed with 26 test files and 132 tests.
- Docker built CLI `tools/list` smoke showed `hadara.evidence.attach` only with `--enable-evidence-attach`.
- Docker built CLI `harness validate --task T-0048 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with T-0049 MCP Evidence Attach Safety Tests. Focus on workspace boundary, public artifact redaction, and CLI evidence JSON parity for the opt-in tool.
