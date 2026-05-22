# T-0026 Agent Loop Evidence Attachment

## Goal

Attach deterministic fake-shell agent loop observations to Task Capsule evidence so tool-using harness runs leave reviewable artifacts.

## Scope

- Add evidence attachment for fake-shell observations produced by `hadara run`.
- Write a managed public text artifact for deterministic fake-shell observations.
- Expose attached evidence metadata in the `hadara run --json` result.
- Preserve deterministic harness behavior and avoid real shell execution.
- Add focused regression tests.

## Out of Scope

- Real shell execution.
- Real provider adapters.
- Full agent controller work.
- Dashboard or MCP bridge expansion.

## Status

Done
