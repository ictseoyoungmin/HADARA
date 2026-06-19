# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-slice.test.ts tests/unit/context-cache-store.test.ts tests/unit/context-graph-builder.test.ts tests/unit/context-pack.test.ts tests/unit/context-routing-performance-baseline-script.test.ts` | Focused C4/C6/context-pack/benchmark regression coverage. | Yes | Passed in Docker ext4 temp copy: 5 files, 38 tests. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| Docker ext4 temp-workspace `npm run build` | TypeScript/schema validation before dist sync. | Yes | Passed. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| Docker ext4 temp-workspace `npm run check` | Full repository regression validation. | Yes | Passed: 135 files, 889 tests. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI `version --verbose --json` | Yes | Confirms refreshed `dist` is current after CLI/source changes. | Passed: `distLooksStale:false`. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| Built CLI context slice boundary smoke | Yes | Confirms raw read boundary behavior through public CLI surface. | Passed: `.hadara/tmp/example.txt` returned `CONTEXT_SLICE_OUTSIDE_PROJECT`; `.hadara/docs-registry.json` returned `ok:true`. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
| `git diff --check` | Yes | Prevents whitespace drift. | Passed. | `ev:T-0376:fc7d0da873a64f9b879d6f84` |
