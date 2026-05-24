# T-0078 Tools List Read Model

## Goal

Add a stable `hadara.tools.list.v1` discovery report so external agents can inspect current CLI/MCP capabilities, the opt-in evidence attach surface, and explicitly disabled shell/provider/release/write surfaces.

## Scope

- Add a shared tools-list read model.
- Expose it through `hadara tools list --json`.
- Expose it as read-only MCP `hadara.tools.list`.
- Document the contract and keep default MCP startup read-only.

## Out of Scope

- Enabling shell execution, provider calls, release/package execution, or broad MCP writes.
- Making evidence attach default-on.
- Adding active-run or debt MCP tools.

## Status

Done
