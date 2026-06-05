# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git status --short` | Confirm clean source state before publish prep. | Yes | Passed before T-0269 creation | No output before creating the T-0269 capsule. |
| `node dist/cli/main.js release dry-run --json` | Recheck release readiness. | Yes | Passed | `ok:true`, readiness ready, blockers 0, warnings 0. |
| `node dist/cli/main.js release publish --mode dry-run --approval-actor local-operator --approval-reason "T-0269 pre-publish readiness verification only" --json` | Recheck approval-gated publish readiness without mutation. | Yes | Passed with warnings | `ok:true`; `NPM_TOKEN` and GitHub Release token missing warnings; all mutation flags false. |
| `git diff --check` | Check README/task doc whitespace after edits. | Yes | Passed | No whitespace errors. |
| `bash -n scripts/release/manual-publish-rc.sh` | Validate manual publish helper syntax after hardening and release-artifact ordering fix. | Yes | Passed | No syntax errors. |
| `docker exec hadara-dev bash -lc '... npm run test:focused -- tests/unit/init.test.ts tests/unit/dashboard-static.test.ts'` | Reproduce reviewer-provided README init-profile and dashboard cache regressions in Docker. | Yes | Passed | 2 files / 34 tests passed; `dashboard-static.test.ts` passed the read-only API cache warm-hit assertion. |
| `docker exec hadara-dev bash -lc '... npm run test:focused -- tests/unit/init.test.ts'` | Recheck README init-profile contract after release wording polish. | Yes | Passed | 1 file / 19 tests passed. |
| `docker exec hadara-rc-dryrun bash -lc 'cd /workspace && npm run test:focused -- tests/unit/dashboard-static.test.ts'` | Recheck the slow RC dry-run container that reported cache `stale` instead of `hit`. | Yes | Passed | 1 file / 15 tests passed; read-only dashboard API route test passed in 161563ms without TTL-expiry failure. |
| `docker exec hadara-rc-dryrun bash -lc 'cd /workspace && npm run test:focused -- tests/unit/dashboard-cache.test.ts tests/unit/dashboard-static.test.ts'` | Recheck cache timestamp fix and the slow dashboard static route after starting TTL after report creation completes. | Yes | Passed | 2 files / 20 tests passed; `dashboard-static.test.ts` route test passed in 151146ms. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm token presence check | Yes | Publish cannot proceed without token presence. | Passed as blocker | `NPM_TOKEN=missing`; token value not printed. |
| GitHub Release token presence check | No | GitHub Release remains secondary/deferred for this npm publish path. | Warning | GitHub release token missing; no token value printed. |
| publish execute | Conditional | Requires explicit operator approval, clean committed README/package evidence, and token presence. | Attempted but did not reach publish | Manual script stopped at `release artifact` with `RELEASE_ARTIFACT_WORKTREE_DIRTY` because package/clean-checkout evidence had already dirtied the worktree; script ordering was fixed. |
| npm view after publish | Conditional | Only meaningful after publish. | Not Run | No registry publish occurred. |
| `node dist/cli/main.js evidence lint --task T-0269 --json` | Validate T-0269 evidence records. | Yes | Passed | Final check: 21 records, 0 errors, 0 warnings. |
| `node dist/cli/main.js task status --task T-0269 --json` | Confirm capsule state. | Yes | Passed with expected Draft blockers | Report generated; blockers are expected because publish is not complete and T-0269 remains Draft. |
