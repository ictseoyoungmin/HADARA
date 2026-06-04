# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git status --short` | Confirm clean worktree before artifact refresh. | Yes | Pending | Command output. |
| `npm run dev:docker-check` | Validate release artifact npm-cache hardening source change. | Yes after code change | Pending | Command output. |
| `npm run dev:docker-sync-build` | Refresh `dist` after release artifact service change. | Yes after code change | Pending | Command output. |
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0245` | Generate and attach current release artifact evidence. | Yes | Pending | Command output and attached evidence artifact. |
| `node dist/cli/main.js release dry-run --json` | Confirm release dry-run readiness after artifact refresh. | Yes | Pending | Command output. |
| `node dist/cli/main.js task ready --task T-0245 --level done --json` | Done-level capsule validation. | Yes | Pending | Command output. |
| `node dist/cli/main.js task close --task T-0245 --execute --json` | Append canonical close evidence. | Yes | Pending | Command output. |
| `node dist/cli/main.js task audit-close --task T-0245 --json` | Verify close record. | Yes | Pending | Command output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| First refresh attempt | Informational | Clean-worktree guard passed, but npm pack failed before cache hardening. | Failed as expected for discovered cache issue | Failed evidence record attached at 2026-06-04T06:29:42Z. |
| Docker full check | Yes after code change | T-0245 now changes release artifact service code. | Pending | Command output. |
| Security smoke | No | Release artifact report and dry-run privacy flags cover no secret/token exposure. | Pending | Release command output. |
| Integration smoke | No | This capsule runs the release artifact integration command directly. | Covered by routine command | Release artifact output. |
