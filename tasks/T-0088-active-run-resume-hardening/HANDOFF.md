# Handoff

## Last Completed

- Active-run projection now resolves the canonical Task Capsule path from `activeRun.taskId`.
- Projection/resume surfaces warn with `ACTIVE_RUN_CAPSULE_MISMATCH` when local manifest `capsule` differs from the canonical path.
- Resume guidance uses the canonical Task Capsule path in `resume.capsule` and `resumePrompt.mustRead` when the task exists.
- Added schema fixtures for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1`, and registered both in `src/schemas/schema-index.json`.
- Strengthened docs/help text that `run-state resume` is read-only guidance and does not resume a process.
- Validation passed in Docker:
  - `npx vitest run tests/unit/active-run-state.test.ts tests/unit/schema-fixtures.test.ts tests/unit/mcp-tools.test.ts tests/contract/mcp-bridge-contract.test.ts`
  - `npm run check`
  - Built CLI smoke for `run-state resume --json`

## Next Recommended Step

Continue with Policy Matrix Refactor or the next evidence/security hardening slice. Keep active-run writes, schema runtime enforcement, broad MCP writes, shell execution, provider calls, and dashboard live APIs deferred.
