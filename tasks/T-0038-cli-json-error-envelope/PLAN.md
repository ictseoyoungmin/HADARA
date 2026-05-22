# Plan

1. Add `src/cli/errors.ts` for stable CLI JSON error envelopes.
2. Update `src/cli/main.ts` top-level catch to use raw `--json` detection.
3. Add regression coverage for JSON parse/validation failures.
4. Run Docker validation and built CLI smokes.
5. Update evidence and handoff docs.
