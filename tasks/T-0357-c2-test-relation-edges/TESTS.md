# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/code-index.test.ts` | Run focused code-index test relation coverage. | Yes | Passed: 1 file / 8 tests. | `ev:T-0357:6406481495244038961bd0de` |
| Docker `npm run build` | Build TypeScript before refreshing workspace `dist`. | Yes | Passed. | `ev:T-0357:6406481495244038961bd0de` |
| Docker `npm run check` | Run the full repository check when available. | Yes | Passed: 130 files / 832 tests. | `ev:T-0357:6406481495244038961bd0de` |
| Built CLI `version --json` | Confirm refreshed workspace `dist` is current. | Yes | Passed with `distLooksStale:false`. | `ev:T-0357:6406481495244038961bd0de` |
| Built internal code-index schema smoke | Validate `hadara.codeIndex.v1` report from refreshed `dist`. | Yes | Passed: 315 files, 1045 symbols, 3893 edges, 781 `TESTS_FILE`, 163 `VALIDATED_BY_EVIDENCE`, 3363 explicit, 457 heuristic, 73 derived, 58 warnings. | `ev:T-0357:6406481495244038961bd0de` |
| `git diff --check` | Check whitespace and patch hygiene. | Yes | Passed. | `ev:T-0357:6406481495244038961bd0de` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security boundary changed. | Not Run | `ev:T-0357:6406481495244038961bd0de` |
| Integration smoke | No | No public integration surface changed. | Not Run | `ev:T-0357:6406481495244038961bd0de` |
