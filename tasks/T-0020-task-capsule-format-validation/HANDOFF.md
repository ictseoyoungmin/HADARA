# Handoff

## Last Completed

- Added Task Capsule Markdown format validation to `src/harness/validate.ts`.
- Added regression coverage for `ACCEPTANCE.md`, `FILES.md`, `TESTS.md`, `RISKS.md`, and `HANDOFF.md` drift.
- Verified Docker `npm ci && npm run check`: 15 test files passed, 59 tests passed.
- Verified T-0019 and T-0020 with `hadara harness validate --task <id> --json`: both returned `ok: true`.

## Next Recommended Step

Continue to a minimal agent loop harness, now using the stricter Task Capsule format validation gate before marking work Done.
