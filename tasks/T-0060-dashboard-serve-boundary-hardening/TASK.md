# T-0060 Dashboard Serve Boundary Hardening

## Goal

Harden the static dashboard serving boundary before any future live dashboard integration work.

## Scope

- Restrict dashboard static responses to safe read-only HTTP methods.
- Add response security headers for served dashboard assets.
- Expand tests for method rejection, encoded traversal rejection, and no arbitrary file exposure.
- Keep live CLI execution, MCP, writes, streaming, and persistence out of scope.

## Out of Scope

- Live dashboard data integration.
- Authentication or multi-user server behavior.
- Serving arbitrary static directories.
- Provider adapters or agent-controller work.

## Status

Done
