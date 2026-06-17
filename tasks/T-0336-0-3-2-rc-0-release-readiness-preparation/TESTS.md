# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run dev:docker-sync-build | Full Docker validation and `dist` refresh. | Yes | Not Run | TBD |
| node dist/cli/main.js release artifact --execute --json --attach-evidence --task T-0336 | Generate release artifact evidence. | Yes | Not Run | TBD |
| node dist/cli/main.js package smoke --execute --attach-evidence --task T-0336 --json | Run package smoke evidence. | Yes | Not Run | TBD |
| node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0336 --json | Run clean-checkout smoke evidence. | Yes | Not Run | TBD |
| node dist/cli/main.js release gate --mode strict --json | Strict release gate. | Yes | Not Run | TBD |
| node dist/cli/main.js release dry-run --json | Release dry-run cross-check. | Yes | Not Run | TBD |
| node dist/cli/main.js release publish --mode dry-run --json | Publish dry-run without mutation. | Yes | Not Run | TBD |
| git diff --check | Whitespace validation. | Yes | Not Run | TBD |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| npm publish | No | Explicitly out of scope; T-0337 owns publish. | Not Run | Must remain not run. |
| GitHub Release creation | No | Explicitly out of scope. | Not Run | Must remain not run. |
