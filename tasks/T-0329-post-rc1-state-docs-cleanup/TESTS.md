# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `rg -n "T-0329 Post rc1 state docs cleanup\|T-0328 0\\.3\\.1-rc\\.1 Post-Publish Installed-Package Recycle\|T-0327 0\\.3\\.1-rc\\.1 Approval-Gated Publish\|T-0326 prepared\|T-0327 published\|T-0328 verified" docs/AGENT_HANDOFF.md docs/RELEASE_NOTES.md docs/PROJECT_STATE.md docs/DEVELOPMENT_SLICES.md tasks/T-0329-post-rc1-state-docs-cleanup` | Confirm targeted post-rc1 handoff/release-note/project-state/slice wording is present. | Yes | Passed | `ev:T-0329:7cf046ee6b4a4400b8d50912` |
| `git diff --check` | Confirm documentation edits have no whitespace errors. | Yes | Passed | `ev:T-0329:7cf046ee6b4a4400b8d50912` |
| `node dist/cli/main.js task status --task T-0329 --json` | Confirm task status projection and identify expected pre-finish blockers. | Yes | Passed with expected pre-finish blockers | `ev:T-0329:7cf046ee6b4a4400b8d50912` |
| `node dist/cli/main.js task ready --task T-0329 --level done --json` | Verify done-level readiness before close. | Yes | Passed with blockers=0 and warnings=0 | `ev:T-0329:47d514f1292c418b91e7f9f0` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker/source test suite | No | This capsule changes documentation state only and does not touch runtime/source behavior. | Not Run | Scope decision D-1 |
| npm/registry/release mutation checks | No | T-0327/T-0328 already completed publish/recycle verification; T-0329 performs no release mutation. | Not Run | Scope decision D-1 |
