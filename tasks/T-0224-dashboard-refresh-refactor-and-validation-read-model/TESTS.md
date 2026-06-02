# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 588 tests; built CLI smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02. |
| `node --input-type=module -e "...dashboard refresh/latest validation smoke..."` | Verify built dashboard routes after refactor. | Yes | Passed: `/api/dashboard/refresh` accepted and completed one run; core/timeline/debt projections present; core and timeline latest validation fields use latest Docker result and `latestContainsT0096:false`. | Command output observed 2026-06-02. |
| `git diff --check` | Check patch whitespace. | Yes | Passed. | Command exited 0. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No new browser mutation, shell, provider, MCP write, or secret surface. | Not Run | Read-only boundary preserved by existing dashboard static tests. |
| Integration smoke | Yes | Dashboard refresh/status routes changed. | Passed | Built route smoke covered refresh completion and latest validation projection fields. |
