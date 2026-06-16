# Tests

## Required Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Full Docker validation, build refresh, and `dist` sync. | Yes | Passed on rerun | `command:T-0326:docker-sync-build-timeout` records the first timeout; `command:T-0326:docker-sync-build` records the passing rerun. |
| `node dist/cli/main.js release artifact --execute --json --attach-evidence --task T-0326` | Refresh release artifact evidence for `0.3.1-rc.1`. | Yes | Passed | `artifacts/release-artifact/2026-06-16T07-57-31.215Z-report.json`; package `0.3.1-rc.1`, file count 213, no publish/GitHub/Docker mutation. |
| `node dist/cli/main.js package smoke --execute --attach-evidence --task T-0326 --json` | Validate packaged CLI smoke from disposable workspace. | Yes | Passed on escalated rerun | First sandbox run failed with npm cache `EROFS`; escalated rerun passed with `artifacts/package-smoke/2026-06-16T08-01-39.634Z-summary.json`. |
| `node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0326 --json` | Validate clean checkout package/readiness smoke. | Yes | Passed | `artifacts/clean-checkout-smoke/2026-06-16T08-07-22.016Z-summary.json`; npm ci, build, check, doctor, ops status, and strict gate passed. |
| `node dist/cli/main.js release gate --mode strict --json` | Check strict release readiness gate. | Yes | Passed | `command:T-0326:strict-release-gate`; latest package-smoke, clean-checkout, and release artifact evidence are T-0326/schema-valid. |
| `node dist/cli/main.js release dry-run --json` | Cross-check release evidence freshness without mutation. | Yes | Passed | `command:T-0326:release-dry-run`; readiness `ready`, blockers 0, warnings 0, package `0.3.1-rc.1`, commit `657e97e47b4fbfe4b0ceee3507a3a9dbed88c89d`. |
| `node dist/cli/main.js release publish --mode dry-run --json` | Confirm publish planning remains dry-run/no-mutation. | Yes | Passed | `command:T-0326:publish-dry-run`; metadata publishable, token warnings only, `NO_MUTATION_EXECUTED` passed. |
| `git diff --check` | Catch whitespace errors before commit. | Yes | Passed | `command:T-0326:git-diff-check`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Manual publish helper execute | No | Actual npm publish belongs to T-0327 after operator authentication and approval. | Not Run | Out of scope. |
| Post-publish installed-package recycle | No | Consumer recycle belongs to T-0328 after npm publish. | Not Run | Out of scope. |
