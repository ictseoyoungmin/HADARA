# Handoff

## Last Completed

- Added `hadara harness validate --level draft|done`.
- Preserved draft-level structural validation as the default.
- Added done-level checks for `TASK.md` status, acceptance completion, evidence records, and non-placeholder handoff sections.
- Added focused harness validation tests for draft compatibility, done-level failures, done-level success, and unsupported levels.
- Docker `npm ci && npm run check` passed: 21 test files passed, 96 tests passed.
- Docker built CLI `harness validate --task T-0029 --level done --json` returned `ok: true`.

## Next Recommended Step

Consider the run scenario scaffold helper next.
