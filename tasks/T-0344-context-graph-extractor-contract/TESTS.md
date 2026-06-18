# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts` | Focused extractor contract and adjacent schema contract validation. | Yes | Passed: 2 files / 8 tests. | `ev:T-0344:567e18dd540c4ea085934770`. |
| Docker `npm run build` | TypeScript build and `dist` generation in the reusable container copy. | Yes | Passed. | `ev:T-0344:567e18dd540c4ea085934770`. |
| Docker `npm run check` | Full repository check. | Yes | Passed: 121 files / 799 tests. | `ev:T-0344:567e18dd540c4ea085934770`. |
| `node dist/cli/main.js version --json` | Built workspace CLI freshness smoke after dist refresh. | Yes | Passed with `build.distLooksStale:false`. | `ev:T-0344:567e18dd540c4ea085934770`. |
| `git diff --check` | Whitespace/diff hygiene. | Yes | Passed. | `ev:T-0344:567e18dd540c4ea085934770`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | No public CLI/read surface was added. | Not Run | TBD |
