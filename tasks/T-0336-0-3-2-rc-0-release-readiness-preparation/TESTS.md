# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run dev:docker-sync-build | Full Docker validation and `dist` refresh. | Yes | Passed after README alignment fix; full suite passed 119 files / 791 tests, packageVersion `0.3.2-rc.0`, `distLooksStale:false`. Initial run was blocked by stale README test expectations. | `ev:T-0336:6016f46604b446e1b8bc83c7`; blocked attempt `ev:T-0336:7593e7432abc46bdb4ba1ef5` |
| node dist/cli/main.js release artifact --execute --json --attach-evidence --task T-0336 | Generate release artifact evidence. | Yes | Passed after checkpoint commit made the worktree clean; generated `hadara-0.3.2-rc.0.tgz`, byteLength 295218, tarball hash `sha256:b5b3e670d7474115919d3688ac9770468370e89dc7dafd6964014f51e9d22202`, manifest hash `sha256:37923357fad4a0bc115aaa845962d34e6a6285c5675c1e17d263a622f53fb712`. Initial dirty-worktree attempt failed as expected. | `ev:T-0336:c8f3c4a1a5eb4fb2b14b3e26`; failed attempt `ev:T-0336:d9f93a1514dd4987b9338509` |
| node dist/cli/main.js package smoke --execute --attach-evidence --task T-0336 --json | Run package smoke evidence. | Yes | Passed on escalated rerun after sandbox npm cache `EROFS`; npm pack, isolated prefix install, installed `hadara doctor --json`, and installed core smoke passed. | `ev:T-0336:9c56833b13ef45369ac26919`; sandbox failure `ev:T-0336:66ba54ee3c5643939137e4ce` |
| node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0336 --json | Run clean-checkout smoke evidence. | Yes | Passed on escalated rerun after sandbox npm cache/write failure; copied source, `npm ci`, build, check, built doctor, ops status, and strict release gate passed. | `ev:T-0336:9e05a5302cfb43d289309397`; sandbox failure `ev:T-0336:b3708c20f6e046bea3803e47` |
| node dist/cli/main.js release gate --mode strict --json | Strict release gate. | Yes | Passed with latest T-0336 release artifact, package smoke, clean-checkout smoke, metadata, and release policy evidence. | `ev:T-0336:6f1ec36b592c41849b5c8907` |
| node dist/cli/main.js release dry-run --json | Release dry-run cross-check. | Yes | Passed; readiness `ready`, blockers 0, warnings 0, commit `06473d7349b81ff721c31ab1cc2f3baed6659c52`; publish/GitHub/Docker steps remained planned-only. | `ev:T-0336:1139c0fdb00c4073aaf36ebe` |
| node dist/cli/main.js release publish --mode dry-run --json | Publish dry-run without mutation. | Yes | Passed; NPM_TOKEN/GitHub token absence remained warning-only, and mutation flags stayed false. | `ev:T-0336:5b64cf958b404c84978715ab` |
| git diff --check | Whitespace validation. | Yes | Passed with exit 0. | `ev:T-0336:d691277c751d49a999c0544b` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Explicitly out of scope; T-0337 owns publish. | Not Run | Publish dry-run only; `publishExecuted:false`. |
| GitHub Release creation | No | Explicitly out of scope. | Not Run | Publish dry-run only; `githubReleaseCreated:false`. |
