# Context

- `docs/AGENT_HANDOFF.md` recommends a minimal agent loop harness with fake tools after provider fallback and policy preflight work.
- T-0017 completed shell execution preflight but intentionally did not execute shell commands.
- T-0018 completed provider fallback orchestration and left agent controller integration out of scope.
- This slice adds deterministic fake shell observations so future agent-loop work can test tool behavior without real shell execution.
- Real shell execution, interactive approval, dashboard, MCP server body, and real provider adapters remain out of scope.
