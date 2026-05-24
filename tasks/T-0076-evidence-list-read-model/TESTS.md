# Tests

## Required

- Docker `npm test -- --run tests/unit/evidence-list.test.ts tests/unit/evidence-json.test.ts tests/unit/mcp-tools.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0076 --level done --json --project /workspace`

## Optional

- CLI smoke for `hadara evidence list --task T-0076 --json`.
