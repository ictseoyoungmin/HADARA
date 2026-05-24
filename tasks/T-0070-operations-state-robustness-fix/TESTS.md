# Tests

## Required

- Docker `npm test -- tests/unit/active-run-state.test.ts tests/unit/status-json.test.ts tests/unit/operational-debt.test.ts tests/contract/cli-mcp-service-parity.test.ts`.
- Docker `npm run check`.
- Docker `node dist/cli/main.js harness validate --task T-0070 --level done --json`.

## Focused

- Active run corrupt/missing-task handling.
- Operational debt premature acceptance guard.
- Shared Markdown section extraction.

## Optional

- Remote CI verification after push/PR.
