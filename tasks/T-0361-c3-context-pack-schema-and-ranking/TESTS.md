# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed via Docker sync-build | `ev:T-0361:dc44300239e5445fbc519132` |
| npm run check | Run the full repository check when available. | Yes | Passed via Docker sync-build | `ev:T-0361:dc44300239e5445fbc519132` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host focused test/build | No | Host dependencies are absent in this workspace. | Failed: `vitest`/`tsc` not found; Docker path used instead. | Capsule note; not a product failure. |
| Initial Docker dev check | No | Same full validation path before test expectation adjustment. | Failed: budget truncation assertion expected a warning without over-budget candidates. | `ev:T-0361:7079390135944e8492c2696d`, resolved by `ev:T-0361:08e9954c022d4965946f5968` |
| Docker sync-build | Yes | Required after source/schema changes to refresh workspace `dist`. | Passed: 131 files / 839 tests, built version smoke `distLooksStale:false`. | `ev:T-0361:dc44300239e5445fbc519132` |
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
