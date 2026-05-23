# T-0053 Operations Status JSON

## Goal

Provide a single Operations Status JSON snapshot that dashboards and external agents can read.

## Scope

- Add `hadara status --json`.
- Add alias support for `hadara ops status --json`.
- Read project status from existing HADARA docs and Task Capsules.
- Document the JSON contract in `docs/OPERATIONS_STATUS_CONTRACT.md`.
- Add design reference docs for the dashboard mockup without implementing dashboard UI.

## Out of Scope

- Dashboard HTML implementation.
- React/Vite project setup.
- Dashboard routing or state management.
- Live MCP streams.
- Provider, run queue, or agent-controller UI.

## Status

Done
