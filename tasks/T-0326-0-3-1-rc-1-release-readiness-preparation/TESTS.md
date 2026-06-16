# Tests

## Required Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Full Docker validation, build refresh, and `dist` sync. | Yes | Passed on rerun | `command:T-0326:docker-sync-build-timeout` records the first timeout; `command:T-0326:docker-sync-build` records the passing rerun. |
| `node dist/cli/main.js release artifact --execute --json --attach-evidence --task T-0326` | Refresh release artifact evidence for `0.3.1-rc.1`. | Yes | Not Run | Pending. |
| `node dist/cli/main.js package smoke --execute --attach-evidence --task T-0326 --json` | Validate packaged CLI smoke from disposable workspace. | Yes | Not Run | Pending. |
| `node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0326 --json` | Validate clean checkout package/readiness smoke. | Yes | Not Run | Pending. |
| `node dist/cli/main.js release gate --mode strict --json` | Check strict release readiness gate. | Yes | Not Run | Pending. |
| `node dist/cli/main.js release dry-run --json` | Cross-check release evidence freshness without mutation. | Yes | Not Run | Pending. |
| `node dist/cli/main.js release publish --mode dry-run --json` | Confirm publish planning remains dry-run/no-mutation. | Yes | Not Run | Pending. |
| `git diff --check` | Catch whitespace errors before commit. | Yes | Passed pre-artifact | Clean pre-artifact run; final run pending after release evidence. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Manual publish helper execute | No | Actual npm publish belongs to T-0327 after operator authentication and approval. | Not Run | Out of scope. |
| Post-publish installed-package recycle | No | Consumer recycle belongs to T-0328 after npm publish. | Not Run | Out of scope. |
