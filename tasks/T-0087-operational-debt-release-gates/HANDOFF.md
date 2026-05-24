# Handoff

## Last Completed

- Added severity and aggregate counts to the operational debt report.
- Added CLI read surfaces `hadara debt list --json` and `hadara debt show <id> --json`.
- Added read-only MCP tools `hadara.debt.list` and `hadara.debt.show`.
- Added debt aggregate counts to `hadara ops status --json`.
- Added read-only `hadara release gate --json`, warning on open high-severity operational debt without release execution.
- Updated capability discovery, CLI/MCP contracts, operational-debt docs, dashboard status fixture/fallback, and focused tests.

## Next Recommended Step

Continue with Policy Matrix Refactor or the next evidence/security hardening slice. Keep persisted debt mutation, MCP release execution, broad MCP writes, shell execution, provider calls, and dashboard live APIs deferred.
