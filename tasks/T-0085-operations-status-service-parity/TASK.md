# T-0085 Operations Status Service Parity

## Goal

Continue Service Parity Expansion by moving Operations Status JSON report creation behind a named shared service boundary.

## Scope

- Add `src/services/operations-status-service.ts` as the shared report-builder boundary for `hadara.ops.status.v1`.
- Route CLI `hadara status --json` and `hadara ops status --json` through the shared operations status service.
- Keep `src/cli/status-json.ts` as a compatibility export so existing imports do not break.
- Update focused tests to import the shared service boundary directly.
- Record validation evidence and refresh handoff/state tracking.

## Out of Scope

- No Operations Status schema changes.
- No dashboard live API integration.
- No MCP active-run/debt/status tools.
- No write tools, shell execution, provider calls, or release gates.

## Status

Done
