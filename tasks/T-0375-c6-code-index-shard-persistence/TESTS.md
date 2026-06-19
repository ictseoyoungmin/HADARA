# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-cache-store.test.ts tests/unit/context-graph-builder.test.ts tests/unit/context-graph-cli.test.ts tests/unit/code-index.test.ts` in Docker temp workspace | Focused code-index/cache/graph regression coverage. | Yes | Passed: 4 files, 41 tests | ev:T-0375:b292024f4a504e08b624f834 |
| `npm run build` in Docker temp workspace | TypeScript build validation before dist sync. | Yes | Passed | ev:T-0375:cf8bf56ec33d4847be643074 |
| `npm run check` in Docker temp workspace | Full repository build and test validation. | Yes | Passed: 134 files, 885 tests | ev:T-0375:cf8bf56ec33d4847be643074 |
| `npm run test:focused -- ...` on host | Host fallback check. | No | Failed: `vitest` unavailable in host node_modules; resolved by Docker focused/full validation. | ev:T-0375:5679e0ca8b2b446a83ce07d1; resolved by ev:T-0375:10c7080a108e4458b35ae699 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI `version --verbose --json` | Yes | Proves refreshed `dist` is current after Docker build sync. | Passed: `distLooksStale=false` | ev:T-0375:a4f37048f61b4709b68d8550 |
| Built CLI `context cache warm --json` dry-run | Yes | Proves `codeIndex` shard appears in warm plan without writes. | Passed: planned `.hadara/local/cache/context/code-index.json` | ev:T-0375:a4f37048f61b4709b68d8550 |
| Built CLI `context graph --include-code --json` on full repository | No | Smoke only; output is large and currently includes existing unresolved JSON import warnings. | Passed with warnings | local smoke output |
| `git diff --check` | Yes | Prevents whitespace drift. | Passed | ev:T-0375:42fe26f02c1640e08f42c1db |
