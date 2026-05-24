# Tests

## Required

- Docker `npm test -- tests/unit/operational-debt.test.ts`.
- Docker `npm run check`.
- Docker `node dist/cli/main.js harness validate --task T-0069 --level done --json`.

## Focused

- Debt records, capsule size indicators, premature acceptance warning.

## Optional

- Wire operational debt into dashboard/status surfaces in a later slice.
