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
| Release artifact | Yes | Verify whitelisted tarball/checksum/manifest generation without publish mutation. | Passed: `hadara-0.3.3-rc.0.tgz` metadata generated with package contents verified. | ev:T-0401:125c51d2304a4d689c957bab |
| Package smoke | Yes | Verify npm pack, isolated install, installed doctor, and core feature smoke. | Passed on approved external rerun after sandbox npm cache `EROFS` failure. | Failed env: ev:T-0401:0bdf36dd8aed46258dbf3364; passed: ev:T-0401:698672f04c9e4ba394e616c2; resolved: ev:T-0401:3c4a72ff0ac3434ab3faabcc |
| Clean-checkout smoke | Yes | Verify clean dependency install, build/check, built CLI doctor/status/gate in a disposable checkout. | Passed on approved external rerun after sandbox `npm ci` failure. | Failed env: ev:T-0401:e23a74651c2d43d38cce2e23; passed: ev:T-0401:211f174377cf41eaba9f707b; resolved: ev:T-0401:3c4a72ff0ac3434ab3faabcc |
| Strict release gate | Yes | Verify release readiness gates over package metadata and evidence. | Passed. | ev:T-0401:7811ff0d1d1b47aea85f6fcf |
| Release dry-run | Yes | Verify release readiness without mutation. | Passed: readiness ready, blockers 0, warnings 0. | ev:T-0401:34875afe7c1c4a6c802a0a0d |
| Publish dry-run | Yes | Verify approval/token/mutation boundaries without executing publish. | Passed: no publish/GitHub/Docker mutation; token warnings expected for no-publish readiness capsule. | ev:T-0401:9bffce41eea94e728636609a |
