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
| Release artifact | Yes | Release dry-run freshness for current version. | Blocked: command returned `RELEASE_ARTIFACT_WORKTREE_DIRTY` because pending release changes are uncommitted. | `ev:T-0340:72dc2440ba274131a9cbe8cb` |
| Strict release gate | Yes | Read-only release gate. | Passed; release dry-run remains blocked only by stale/missing `0.3.2` release artifact evidence. | `ev:T-0340:d364684c5ab6459498683f5c` |
| Release dry-run | Yes | Publish planning readiness. | Blocked: `RELEASE_ARTIFACT_EVIDENCE_NOT_READY` because latest passed release artifact evidence is still T-0336 for `0.3.2-rc.0`. | Command output; summarized in `ev:T-0340:d364684c5ab6459498683f5c` |
| Publish dry-run | Yes | Approval-gated publish preflight. | Blocked: release dry-run prerequisite blocked; `NPM_TOKEN` absent; no mutation executed. | Command output |
| npm registry pre-publish check | Yes | Confirm exact stable version is still unpublished before any publish attempt. | Passed: sandbox lookup hit DNS `EAI_AGAIN`; escalated `npm view hadara@0.3.2 version` returned E404 No match found. | `ev:T-0340:c623c949e1d94c89bd87529c` |
