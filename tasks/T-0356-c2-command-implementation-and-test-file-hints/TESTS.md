# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/code-index.test.ts tests/unit/command-registry.test.ts` | Run focused code-index command hint coverage. | Yes | Passed: 2 files / 15 tests. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| Docker `npm run build` | Build TypeScript before refreshing workspace `dist`. | Yes | Passed. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| Docker `npm run check` | Run the full repository check when available. | Yes | Passed: 130 files / 831 tests. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| Built CLI `version --json` | Confirm refreshed workspace `dist` is current. | Yes | Passed with `distLooksStale:false`. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| Built internal code-index schema smoke | Validate `hadara.codeIndex.v1` report from refreshed `dist`. | Yes | Passed: 315 files, 1423 imports, 1045 exports, 1045 symbols, 2955 edges, 76 command implementation edges, 6 test-file hint edges, 45 command files, 58 warnings. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| `git diff --check` | Check whitespace and patch hygiene. | Yes | Passed. | `ev:T-0356:3f6509b1f0da4c569b03befa` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| Integration smoke | No | No public integration surface changed. | Not Run | `ev:T-0356:3f6509b1f0da4c569b03befa` |
