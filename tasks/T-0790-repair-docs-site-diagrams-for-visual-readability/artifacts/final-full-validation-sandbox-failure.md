# Final Full Validation Sandbox Failure

## Passed before failure

- `npm run typecheck:src`: passed.
- `npm run typecheck:tools`: passed.
- Main Vitest suite: 130 files passed, 1 skipped; 1,062 tests passed, 8 skipped.

## Failed check

`npm run test:hadara-dev` ran 18 files. Seventeen files passed, while `tests/unit/release-input.test.ts` failed before its assertion because the managed sandbox denied the fixture's `spawnSync git` call:

```text
Error: spawnSync git EPERM
tests/unit/release-input.test.ts:27
execFileSync('git', ['init', '-q'], { cwd: root })
```

This record preserves the initial environment failure. It is not treated as a product assertion failure and requires a retry outside the subprocess restriction.
