# T-0087 Operational Debt Release Gates

## Goal

Promote operational debt into stable read-only surfaces and release-gate warning signals.

## Scope

- Add CLI JSON/text handling for `hadara debt list --json` and `hadara debt show <id> --json`.
- Add read-only MCP tools `hadara.debt.list` and `hadara.debt.show`.
- Extend Operations Status JSON with operational debt aggregate counts.
- Add a read-only release-gate report that warns on open high-severity operational debt without executing release/package actions.
- Register new read surfaces in tools/capability discovery and update protocol docs.

## Out of Scope

- No persisted debt store or debt mutation commands.
- No MCP write tools, MCP release execution, shell execution, provider calls, or packaging/deployment behavior.
- No dashboard live API integration.

## Status

Done
