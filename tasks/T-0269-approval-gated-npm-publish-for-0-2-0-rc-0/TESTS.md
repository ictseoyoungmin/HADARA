# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git status --short` | Confirm clean source state before publish prep. | Yes | Passed before T-0269 creation | No output before creating the T-0269 capsule. |
| `node dist/cli/main.js release dry-run --json` | Recheck release readiness. | Yes | Passed | `ok:true`, readiness ready, blockers 0, warnings 0. |
| `node dist/cli/main.js release publish --mode dry-run --approval-actor local-operator --approval-reason "T-0269 pre-publish readiness verification only" --json` | Recheck approval-gated publish readiness without mutation. | Yes | Passed with warnings | `ok:true`; `NPM_TOKEN` and GitHub Release token missing warnings; all mutation flags false. |
| `git diff --check` | Check README/task doc whitespace after edits. | Yes | Passed | No whitespace errors. |
| `bash -n scripts/release/manual-publish-rc.sh` | Validate manual publish helper syntax after hardening. | Yes | Passed | No syntax errors. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm token presence check | Yes | Publish cannot proceed without token presence. | Passed as blocker | `NPM_TOKEN=missing`; token value not printed. |
| GitHub Release token presence check | No | GitHub Release remains secondary/deferred for this npm publish path. | Warning | GitHub release token missing; no token value printed. |
| publish execute | Conditional | Requires explicit operator approval, clean committed README/package evidence, and token presence. | Not Run | Blocked intentionally. |
| npm view after publish | Conditional | Only meaningful after publish. | Not Run | No registry publish occurred. |
| `node dist/cli/main.js evidence lint --task T-0269 --json` | Validate T-0269 evidence records. | Yes | Passed | Final check: 8 records, 0 errors, 0 warnings. |
| `node dist/cli/main.js task status --task T-0269 --json` | Confirm capsule state. | Yes | Passed with expected Draft blockers | Report generated; blockers are expected because publish is not complete and T-0269 remains Draft. |
