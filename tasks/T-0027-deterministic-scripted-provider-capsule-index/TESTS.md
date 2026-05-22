# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0027 --json`

## Focused

- Provider contract tests for sequential `ScriptedProvider` behavior.
- Task Capsule harness tests for empty `evidence.jsonl` creation.

## Optional

- Built CLI smoke for creating a new task and validating that `evidence.jsonl` exists immediately.
