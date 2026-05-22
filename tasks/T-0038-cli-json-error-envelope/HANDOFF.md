# Handoff

## Last Completed

- Added `src/cli/errors.ts` with `hadara.cli.error.v1` fallback envelopes.
- Updated `src/cli/main.ts` to use raw argv `--json` detection in the top-level catch path.
- Added stable error code and exit code mapping for CLI parse/validation failures.
- Docker `npm ci && npm run check` passed: 22 test files passed, 108 tests passed.
- Built CLI JSON error smokes passed for invalid mode, result, level, project, and missing task inputs.
- Docker built CLI `harness validate --task T-0038 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with T-0039 Policy Safe Command Exactness.
