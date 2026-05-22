# Plan

1. Add `src/core/workspace.ts` with project-relative resolution, realpath containment, and portable relative path helpers.
2. Wire file input readers and public artifact copy through the workspace resolver.
3. Normalize JSON error output for evidence collect, harness replay, and run file boundary failures.
4. Add focused regression tests.
5. Run Docker validation and record evidence.
