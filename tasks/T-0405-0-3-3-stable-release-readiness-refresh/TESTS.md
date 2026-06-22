# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --full --sync-dist --before-hash <hash> --json --project /mnt/f/NowWorking/HADARA-dev` | Run full Docker validation, build, and guarded `dist` refresh for the stable source candidate. | Yes | Initial JSON full run failed before dist sync; raw full rerun passed; focused sync run passed and refreshed `dist`. | `ev:T-0405:5024d9240beb4313b5abd207`, `ev:T-0405:fe93af97444148a2abb57ca0`, `ev:T-0405:d2c9fce2d4fb423ea98c171e` |
| `node dist/cli/main.js package smoke --execute --attach-evidence --task T-0405 --json --project /mnt/f/NowWorking/HADARA-dev` | Verify package smoke for current source and attach reduced public evidence. | Yes | Passed. | `ev:T-0405:7222082ccc8449468c2b3f47` |
| `node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0405 --json --project /mnt/f/NowWorking/HADARA-dev` | Verify clean checkout smoke and attach reduced public evidence. | Yes | Initial execute run failed in `npm run check`; non-JSON rerun and attach-evidence rerun passed. | `ev:T-0405:6fb57bb7c06a46aca53b38a0` |
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0405 --project /mnt/f/NowWorking/HADARA-dev` | Generate release artifact evidence from a clean worktree checkpoint. | Yes | Passed: stable `hadara-0.3.3.tgz`, checksum, and manifest generated; package contents verified. | `ev:T-0405:47d23e856dbe4b7f94502aa8` |
| `node dist/cli/main.js release gate --mode strict --json --project /mnt/f/NowWorking/HADARA-dev` | Verify release readiness gate. | Yes | Passed with fresh T-0405 package, clean-checkout, and artifact evidence. | `ev:T-0405:f3a1bd62ec254e5abeb83de6` |
| `node dist/cli/main.js release dry-run --json --project /mnt/f/NowWorking/HADARA-dev` | Verify release plan remains no-mutation without approval. | Yes | Passed: readiness `ready`, blockers 0, warnings 0, publish/GitHub/Docker execution false. | `ev:T-0405:79a290abc677408b85064993` |
| `npm view hadara@0.3.3 version --registry=https://registry.npmjs.org` | Confirm exact stable version is not already published. | Yes | Passed as pre-publish check: registry returned E404 No match found. | `ev:T-0405:98c78116db1242319eaf3759` |
| `bash scripts/release/manual-publish-rc.sh T-0405` | Dry-run the publish helper only; no `--execute`. | No | Blocked by npm `whoami` E401 because operator is not logged in; no publish mutation ran. | `ev:T-0405:2a474a9ffbd149a780521a95` |
| `git diff --check` | Check whitespace before close. | Yes | Passed. | `ev:T-0405:d2c9fce2d4fb423ea98c171e` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Publish is explicitly out of scope for T-0405. | Not Run | Not applicable. |
| GitHub Release draft | No | GitHub Release creation is a separate explicit mutation. | Not Run | Not applicable. |
| Docker/PyPI publish | No | Non-npm release targets remain deferred/explicit. | Not Run | Not applicable. |
