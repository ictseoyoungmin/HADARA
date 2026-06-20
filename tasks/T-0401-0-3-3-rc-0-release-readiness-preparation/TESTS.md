# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker via `npm run dev:docker-sync-build`: 141 files / 929 tests. | ev:T-0401:1046d97d72a54ca6bd9dabf3 |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker via `npm run dev:docker-sync-build`: `npm ci`, TypeScript build, tests, dist refresh, and built version smoke. | ev:T-0401:1046d97d72a54ca6bd9dabf3 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Built CLI version smoke | Yes | Confirm refreshed `dist` reports the release-candidate version. | Passed: packageVersion `0.3.3-rc.0`, `distLooksStale:false`. | ev:T-0401:b40df25c3a724dacadedbc60 |
| Whitespace check | Yes | Release candidate source should have no whitespace errors. | Passed: `git diff --check`. | ev:T-0401:f1a3aba3d99945738d0d41a6 |
| Host focused tests | No | Host-local `node_modules` are not present in this workspace; Docker is the project validation path. | Not run: `vitest` was unavailable on host, then Docker validation passed. | n/a |
