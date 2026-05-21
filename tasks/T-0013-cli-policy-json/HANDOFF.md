# Handoff

## Last Completed

- Added `src/cli/policy-json.ts` with `hadara.policy.check-shell.v1` report generation.
- Updated `hadara policy check-shell <command> --json` to include mode, command text, shell tokens/operators, and decision.
- Preserved non-JSON decision-only output.
- Mapped denied policy decisions to exit code `2`.
- Added tests for safe assisted commands, denied pipe-to-shell commands, and command extraction.
- Verified Docker `npm ci && npm run check`: 10 test files passed, 42 tests passed.
- Verified policy JSON success, denied exit code 2, and non-JSON smoke paths.

## Next Recommended Step

Continue CLI JSON normalization for Hermes/Evidence commands, or move to Evidence Store artifact handling.
