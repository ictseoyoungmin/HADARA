# Handoff

## Last Completed

- Docker read-only mount validation passed: `npm ci && npm run check`, 18 test files passed and 74 tests passed.
- Docker built CLI validation passed: `node dist/cli/main.js harness validate --task T-0023 --json`, `ok: true`.
- Added `src/core/workspace.ts` with project file resolution, realpath containment, and portable relative paths.
- Applied the resolver to public evidence artifact copy, harness replay scenario reads, `run --script`, and `run --fake-shell-fixtures`.
- Added bounded `run --max-steps` validation for integers from 1 through 32.
- Added regression tests for traversal, absolute outside paths, symlink escape, evidence JSON rejection, replay JSON rejection, and run input parsing.
- `git diff --check` passed.

## Next Recommended Step

Start T-0024 Evidence Artifact Redaction.
