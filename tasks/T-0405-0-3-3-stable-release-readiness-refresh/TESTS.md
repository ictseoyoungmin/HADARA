# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --full --sync-dist --before-hash <hash> --json --project /mnt/f/NowWorking/HADARA-dev` | Run full Docker validation, build, and guarded `dist` refresh for the stable source candidate. | Yes | Not Run | TBD |
| `node dist/cli/main.js package smoke --json --project /mnt/f/NowWorking/HADARA-dev` | Verify package smoke for current source. | Yes | Not Run | TBD |
| `node dist/cli/main.js smoke clean-checkout --json --project /mnt/f/NowWorking/HADARA-dev` | Verify clean checkout smoke. | Yes | Not Run | TBD |
| `node dist/cli/main.js release artifact --execute --json --project /mnt/f/NowWorking/HADARA-dev` | Generate release artifact evidence from a clean worktree checkpoint. | Yes | Not Run | TBD |
| `node dist/cli/main.js release gate --mode strict --json --project /mnt/f/NowWorking/HADARA-dev` | Verify release readiness gate. | Yes | Not Run | TBD |
| `node dist/cli/main.js release dry-run --json --project /mnt/f/NowWorking/HADARA-dev` | Verify release plan remains no-mutation without approval. | Yes | Not Run | TBD |
| `bash scripts/release/manual-publish-rc.sh T-0405` | Dry-run the publish helper only; no `--execute`. | Yes | Not Run | TBD |
| `git diff --check` | Check whitespace before close. | Yes | Not Run | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Publish is explicitly out of scope for T-0405. | Not Run | Not applicable. |
| GitHub Release draft | No | GitHub Release creation is a separate explicit mutation. | Not Run | Not applicable. |
| Docker/PyPI publish | No | Non-npm release targets remain deferred/explicit. | Not Run | Not applicable. |
