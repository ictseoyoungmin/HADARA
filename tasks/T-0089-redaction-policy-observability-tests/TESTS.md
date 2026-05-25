# Tests

## Required

- Docker `npx vitest run tests/unit/redaction.test.ts tests/unit/evidence-json.test.ts`
- Docker `npm run check`
- Docker built CLI `harness validate --task T-0089 --level done --json --project /workspace`

## Optional

- Evidence collect CLI smoke for public artifact policy behavior.
