# Tests

## Required

- `npx vitest run tests/unit/operational-debt.test.ts tests/unit/release-dry-run.test.ts tests/unit/release-publish.test.ts`
- `npm run check`
- `hadara release gate --mode strict --json --project /workspace`
- `hadara release dry-run --json --project /workspace`
- `hadara release publish --mode dry-run --json --project /workspace`
- `hadara package smoke --execute --attach-evidence --task T-0142 --json --project /workspace --timeout 180`
- `hadara release artifact --execute --attach-evidence --task T-0142 --json --project /workspace --timeout 180`
- `hadara smoke clean-checkout --execute --attach-evidence --task T-0142 --json --project /workspace --timeout 240`
- `hadara harness validate --task T-0142 --level done --json --project /workspace`

## Optional

- Re-run release publish dry-run after any evidence or metadata edit.
