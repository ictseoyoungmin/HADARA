# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/context-graph-task-extractors.test.ts tests/unit/context-graph-extractor-contract.test.ts tests/unit/context-graph-schema.test.ts` | Focused task extractor and adjacent context graph contract validation. | Yes | Passed: 3 files / 11 tests. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| Docker `npm run build` | TypeScript build and `dist` generation in the reusable container copy. | Yes | Passed. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| Docker `npm run check` | Full repository check. | Yes | Passed: 122 files / 802 tests. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| `node dist/cli/main.js version --json` | Built workspace CLI freshness smoke after dist refresh. | Yes | Passed with `build.distLooksStale:false`. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| `git diff --check` | Whitespace/diff hygiene. | Yes | Passed. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | No public CLI/read surface was added. | Not Run | TBD |
