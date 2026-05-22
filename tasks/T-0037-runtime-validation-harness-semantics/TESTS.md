# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0037 --level done --json`

## Focused

- Policy JSON/unit tests for invalid permission modes.
- Fake shell and agent loop tests for invalid modes and non-zero exits.
- Evidence CLI and harness validation tests for result enums.
- Run scaffold stale file regression tests.
- Task create global flag parsing regression tests.

## Optional

- Built CLI smokes for invalid mode/evidence/scaffold cases.
