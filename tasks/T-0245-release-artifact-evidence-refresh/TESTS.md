# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git status --short` | Confirm clean worktree before artifact refresh. | Yes | Passed before refresh attempts after scaffold/fix commits. | Command output. |
| `npm run dev:docker-check` | Validate release artifact npm-cache hardening source change. | Yes after code change | Passed: 92 files, 614 tests. | Command output. |
| `npm run dev:docker-sync-build` | Refresh `dist` after release artifact service change. | Yes after code change | Passed: 92 files, 614 tests; `distLooksStale:false`. | Command output. |
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0245` | Generate and attach current release artifact evidence. | Yes | Passed; attached public report artifact for T-0245. | Command output and attached evidence artifact. |
| `node dist/cli/main.js release dry-run --json` | Confirm release dry-run readiness after artifact refresh. | Yes | Passed; `ok:true`, readiness `ready`, blockers 0. | Command output and evidence record. |
| `node dist/cli/main.js release publish --mode dry-run --json` | Confirm publish dry-run gates without mutation. | Yes | Passed; `ok:true`, token warnings only, mutation flags false. | Command output and evidence record. |
| `node dist/cli/main.js task ready --task T-0245 --level done --json` | Done-level capsule validation. | Yes | Passed; blockers 0, warnings 0. | Command output. |
| `node dist/cli/main.js task close --task T-0245 --execute --json` | Append canonical close evidence. | Yes | Passed; close evidence appended. | Command output. |
| `node dist/cli/main.js task audit-close --task T-0245 --json` | Verify close record. | Yes | Passed; verdict `closed-valid`. | Command output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| First refresh attempt | Informational | Clean-worktree guard passed, but npm pack failed before cache hardening. | Failed as expected for discovered cache issue | Failed evidence record attached at 2026-06-04T06:29:42Z. |
| Second refresh attempt | Informational | Disposable npm cache was not enough because Node-spawned npm returned status 0 with empty stdout. | Failed as expected for discovered empty-stdout issue | Failed evidence record attached at 2026-06-04T06:34:49Z. |
| Empty npm stdout fallback | Yes | Node-spawned npm can succeed while returning empty stdout; release artifact must recover from output tarball/staging files. | Passed | `tests/unit/release-artifact.test.ts`; Docker check. |
| Docker full check | Yes after code change | T-0245 now changes release artifact service code. | Passed: 92 files, 614 tests. | Command output. |
| Security smoke | No | Release artifact report and dry-run privacy flags cover no secret/token exposure. | Pending | Release command output. |
| Integration smoke | No | This capsule runs the release artifact integration command directly. | Covered by routine command | Release artifact output. |
