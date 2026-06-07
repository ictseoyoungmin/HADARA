# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run check` | Run build plus full Vitest suite in a reproducible container workspace. | Yes | Passed | `npm run dev:docker-sync-build` passed 100 files / 681 tests and refreshed workspace `dist`. |
| Workspace built CLI version smoke | Confirm synced `dist` reports package version `0.2.0-rc.2`. | Yes | Passed | `node dist/cli/main.js version --verbose --json` returned `packageVersion:"0.2.0-rc.2"` and `distLooksStale:false`. |
| Release helper syntax check | Confirm manual publish helper remains shell-parseable. | Yes | Passed | `bash -n scripts/release/manual-publish-rc.sh`. |
| Strict release gate | Confirm read-only release gate is still green. | Yes | Passed | `node dist/cli/main.js release gate --mode strict --json` returned `ok:true`. |
| Package smoke | Confirm rc2 tarball can install and run core smoke without publish. | Yes | Passed | `env npm_config_cache=/tmp/hadara-npm-cache node dist/cli/main.js package smoke --execute --attach-evidence --task T-0282 --json` returned `ok:true`; an earlier sandbox `$HOME/.npm` cache run failed and is retained as failed evidence. |
| Clean-checkout smoke | Confirm disposable clean checkout can install, build, check, and run built CLI smokes. | Yes | Passed | External network-capable run returned `ok:true`; earlier sandbox runs failed with npm cache/DNS errors and are retained as failed evidence. |
| npm pack dry-run | Confirm package file list and version before publish. | Yes | Passed | `env npm_config_cache=/tmp/hadara-npm-cache npm pack --dry-run --json` produced `hadara-0.2.0-rc.2.tgz` metadata without writing a tarball. |
| npm registry pre-publish version check | Confirm exact rc2 version was not already published before mutation. | Yes | Passed | Read-only `npm view hadara@0.2.0-rc.2 version --registry=https://registry.npmjs.org` returned E404 no match before the operator publish. |
| Release dry-run/readiness smoke | Confirm release surfaces report readiness before helper-mediated publish. | Yes | Passed | The manual helper regenerated release artifact/package/clean evidence from a clean committed rc2 worktree, reran dry-run checks, then prompted before npm publish. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish execute | Yes, operator-only | Explicitly reserved for operator after npm login and clean worktree. | Passed | `scripts/release/manual-publish-rc.sh T-0282 --execute` published `hadara@0.2.0-rc.2` and verified npm view returned `0.2.0-rc.2`; GitHub draft requested false. |
| GitHub Release draft | No | Optional operator path only. | Not Run | Out of scope. |
| Python/PyPI publish | No | Python bridge rc.1 is separate from npm rc.2. | Not Run | Out of scope. |
