# Tests

## Required

- Docker `npx vitest run tests/unit/status-json.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0085 --level done --json --project /workspace`

## Optional

- CLI JSON/text smokes for `hadara status` and `hadara ops status`
