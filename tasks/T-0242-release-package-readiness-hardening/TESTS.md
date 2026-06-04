# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Run Docker build plus full test suite without relying on host `node_modules`. | Yes | Passed: 92 files, 611 tests. | Docker check output. |
| `npm run dev:docker-sync-build` | Rebuild in Docker, rerun full suite, and refresh `/workspace/dist`. | Yes | Passed: 92 files, 611 tests; `distLooksStale:false`. | Docker sync-build output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI release dry-run smoke | Yes | Confirms the shipped `dist` CLI exposes readiness next actions and timing diagnostics. | Passed with expected exit 6 for stale release artifact evidence; `readiness.nextActions[0].id` was `refresh-release-artifact-evidence`; slow stage warning identified `strict-release-gate`. | `node dist/cli/main.js release dry-run --json` output. |
| Security smoke | No | No permission, token, publish, GitHub, Docker image, or installer execution boundary changed. | Not Run | Constraint recorded. |
| Integration smoke | No | No external registry/GitHub publishing or install integration was exercised. | Not Run | Constraint recorded. |
