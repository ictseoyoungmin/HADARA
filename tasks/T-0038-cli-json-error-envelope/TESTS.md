# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0038 --level done --json`

## Focused

- Unit tests for CLI error code and exit code mapping.
- Built CLI smokes for invalid JSON-mode run, policy, evidence, harness, project, and required task inputs.

## Optional

- Non-JSON smoke for unchanged stderr output.
