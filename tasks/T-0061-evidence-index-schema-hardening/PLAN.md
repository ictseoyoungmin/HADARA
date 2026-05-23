# Plan

1. Create the T-0061 Task Capsule.
2. Migrate recent timestamp-only manual evidence records to `time`.
3. Harden `validateEvidenceIndex()` required-field checks.
4. Add regression tests for timestamp-only and missing required evidence fields.
5. Run focused and full Docker validation.
6. Update evidence, state tracking, and handoff.
