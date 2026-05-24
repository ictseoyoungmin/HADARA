# Tests

## Required

- Docker `npm test -- tests/unit/active-run-state.test.ts`.
- Docker `npm run check`.
- Docker `node dist/cli/main.js harness validate --task T-0068 --level done --json`.

## Focused

- Active run manifest read/write, resume projection, stale handoff warning.

## Optional

- Dashboard visual review when active run fields are bound to UI later.
