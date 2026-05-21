# Handoff

## Last Completed

- Added `src/harness/replay.ts` with a minimal JSONL replay schema.
- Added `hadara harness replay <scenario.jsonl> [--json]`.
- Added deterministic replay fixture `tests/fixtures/replay/basic-success.jsonl`.
- Added tests covering success, invalid JSONL, final expectation mismatch, invalid ordering, and missing scenario.
- Verified Docker `npm ci && npm run check`: 7 test files passed, 34 tests passed.
- Verified replay CLI success and failure smoke paths.

## Next Recommended Step

Continue CLI JSON normalization for core commands, or move to Evidence Store artifact handling.
