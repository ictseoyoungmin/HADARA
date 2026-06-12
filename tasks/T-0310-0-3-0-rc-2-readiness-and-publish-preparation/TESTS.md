# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Passed in Docker | `npm run dev:docker-sync-build` passed 117 files / 758 tests. |
| npm run check | Run the full repository check when available. | Yes | Passed in Docker; host blocked | Docker `npm run check` passed through `dev:docker-sync-build`; host `npm run check` failed because `tsc` was not installed in host `node_modules`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| full Docker check | Yes | T-0310 full validation requirement. | Passed | `npm run dev:docker-sync-build` passed 117 files / 758 tests and refreshed workspace `dist`. |
| built CLI version smoke | Yes | Confirm refreshed dist and package version. | Passed | `node dist/cli/main.js version --verbose --json` reported `0.3.0-rc.2` and `distLooksStale:false`. |
| release artifact | Yes | Required release evidence. | Passed | `release artifact --execute --output dist-release --attach-evidence --task T-0310 --json` produced rc.2 tarball/checksum/manifest and attached evidence. |
| package smoke | Yes | Required npm package smoke evidence. | Passed after environment rerun | First host run failed on read-only npm cache; rerun with `NPM_CONFIG_CACHE=/tmp/hadara-t0310-npm-cache` passed and attached evidence. |
| clean-checkout smoke | Yes | Required clean source checkout evidence. | Passed in Docker after host npm failure | Host run failed in `npm ci`; raw reproduction hit npm internal `Exit handler never called`; Docker run passed and attached evidence. |
| release gate strict | Yes | Required release gate. | Passed | `release gate --mode strict --json` returned `ok:true`. |
| release dry-run | Yes | Required release readiness. | Passed | `release dry-run --json` returned `ok:true`, readiness `ready`, blockers 0, warnings 0. |
| release publish dry-run | Yes | Required publish dry-run. | Passed | `release publish --mode dry-run --json` returned `ok:true`, no mutation executed, token warnings only. |
| manual helper guard | Yes | Ensure stale task/version helper path fails closed. | Passed | `bash -n` passed and `manual-publish-rc.sh T-0301` rejected the mismatched rc.1 capsule for `0.3.0-rc.2`. |
| extra rc.2 workflow smokes | Yes | Cover rc.2 user-facing UX changes. | Passed | Fresh init/doctor/docs required-reading, legacy protocol migrate execute, and task finish row preservation smokes passed in `/tmp`. |
