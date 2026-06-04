# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git status --short` | Confirm clean worktree before artifact refresh. | Yes | Pending | Command output. |
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0245` | Generate and attach current release artifact evidence. | Yes | Pending | Command output and attached evidence artifact. |
| `node dist/cli/main.js release dry-run --json` | Confirm release dry-run readiness after artifact refresh. | Yes | Pending | Command output. |
| `node dist/cli/main.js task ready --task T-0245 --level done --json` | Done-level capsule validation. | Yes | Pending | Command output. |
| `node dist/cli/main.js task close --task T-0245 --execute --json` | Append canonical close evidence. | Yes | Pending | Command output. |
| `node dist/cli/main.js task audit-close --task T-0245 --json` | Verify close record. | Yes | Pending | Command output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Docker full check | No | T-0245 should not change source code; T-0244 already passed Docker check and sync-build. | Not Required unless code changes | T-0244 validation baseline. |
| Security smoke | No | Release artifact report and dry-run privacy flags cover no secret/token exposure. | Pending | Release command output. |
| Integration smoke | No | This capsule runs the release artifact integration command directly. | Covered by routine command | Release artifact output. |
