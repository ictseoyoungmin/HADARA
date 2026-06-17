# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker as part of `npm run dev:docker-sync-build`: 119 files / 791 tests. | `ev:T-0340:f46635f835ed42389a0ce9c6` |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker through `npm run dev:docker-sync-build`; built CLI version smoke reported `packageVersion: "0.3.2"` and `distLooksStale:false`. | `ev:T-0340:f46635f835ed42389a0ce9c6` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
| Package smoke | Yes | Stable npm package readiness. | Passed after rerun with `npm_config_cache=/tmp/hadara-npm-cache`; initial sandbox cache attempt failed with npm `EROFS`. | `ev:T-0340:1dfd79eb8e5a4302a2afee7b`; failed prior `ev:T-0340:b0f7d15d1323408487d3ccba` |
| Clean-checkout smoke | Yes | Fresh checkout readiness. | Passed on escalated rerun; initial sandbox attempt failed at `npm ci`. | `ev:T-0340:2d7fdf0a5fe1481782a90338`; failed prior `ev:T-0340:db4478f6bbaa48c09af331f8` |
| Release artifact | Yes | Release dry-run freshness for current version. | Passed after commit `14c840f`: generated `hadara-0.3.2.tgz`, checksum, and manifest for package version `0.3.2`. | `ev:T-0340:a1e1bbaf3a904fce80678f03`; failed prior `ev:T-0340:72dc2440ba274131a9cbe8cb` |
| Strict release gate | Yes | Read-only release gate. | Passed; release dry-run remains blocked only by stale/missing `0.3.2` release artifact evidence. | `ev:T-0340:d364684c5ab6459498683f5c` |
| Release dry-run | Yes | Publish planning readiness. | Passed: readiness `ready`, blockers 0, warnings 0. | `ev:T-0340:06a838ce79be45d4978a2dfd` |
| Publish dry-run | Yes | Approval-gated publish preflight. | Passed in dry-run mode: `ok:true`, release dry-run prerequisites passed, no mutation executed; `NPM_TOKEN` and GitHub token warnings remain. | `ev:T-0340:06a838ce79be45d4978a2dfd` |
| npm registry pre-publish check | Yes | Confirm exact stable version is still unpublished before any publish attempt. | Passed: sandbox lookup hit DNS `EAI_AGAIN`; escalated `npm view hadara@0.3.2 version` returned E404 No match found. | `ev:T-0340:c623c949e1d94c89bd87529c` |
| npm tarball publish dry-run | Yes | Confirm generated tarball can be published with stable `latest` tag without mutation. | Passed with `npm_config_cache=/tmp/hadara-npm-cache`: `npm publish ./dist-release/hadara-0.3.2.tgz --dry-run --tag=latest` returned `+ hadara@0.3.2`. | `ev:T-0340:06a838ce79be45d4978a2dfd` |
