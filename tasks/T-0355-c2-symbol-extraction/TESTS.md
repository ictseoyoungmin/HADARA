# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/code-index.test.ts` | Run focused code-index symbol extraction coverage. | Yes | Passed: 1 file / 6 tests. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| Docker `npm run build` | Build TypeScript before refreshing workspace `dist`. | Yes | Passed. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| Docker `npm run check` | Run the full repository check when available. | Yes | Passed: 130 files / 829 tests. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| Built CLI `version --json` | Confirm refreshed workspace `dist` is current. | Yes | Passed with `distLooksStale:false`. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| Built internal code-index schema smoke | Validate `hadara.codeIndex.v1` report from refreshed `dist`. | Yes | Passed: 315 files, 1422 imports, 1045 exports, 1045 symbols, 2872 edges, 58 warnings. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| `git diff --check` | Check whitespace and patch hygiene. | Yes | Passed. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| Integration smoke | No | No public integration surface changed. | Not Run | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
