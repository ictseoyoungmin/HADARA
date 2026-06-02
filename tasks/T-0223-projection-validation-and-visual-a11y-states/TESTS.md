# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 585 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after task-detail/table parsing follow-up. |
| `git diff --check` | Check patch whitespace. | Yes | Passed | Command exited 0 after follow-up. |
| `node --check dashboard/visual-check.mjs` | Check visual gate JavaScript syntax without Playwright dependencies. | Yes | Passed | Command exited 0. |
| `node -e "...fixture parse/redaction..."` | Parse new projection fixtures and assert no raw project path strings. | Yes | Passed | Printed `visual projection fixtures parse and are redacted`. |
| `npm run test:focused -- tests/unit/dashboard-static.test.ts tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Focused projection validation tests. | Yes | Blocked | Failed before tests because host `vitest` is not installed. |
| `npm run dashboard:build:docker` | Rebuild static dashboard bundle. | Yes | Passed | Docker build rebuilt `docs/design/dashboard/index.html`; bundle reports JS 40.2 kB, CSS 17.0 kB, total 60.2 kB. |
| `npm run dashboard:visual:docker` | Run Playwright/axe visual gate. | Yes | Passed | Projection-ready/detail/stale/refreshing/missing/offline/degraded screenshots/a11y checks passed; screenshots written to `.dashboard-visual`. |
| `node --input-type=module -e "...task-detail/core smoke..."` | Check built `dist` selected-detail availability and handoff table parsing. | Yes | Passed | T-0223 detail returned `statusCode:200`, `ok:true`, `closeState:closed-valid` in 1852 ms; core handoff summaries expose table data rows instead of Markdown header text. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Projection fixtures are read-only/redacted; no new mutation surface. | Covered by redaction/static checks | Fixture strings are path-redacted and static tests assert no browser storage/mutation patterns. |
| Integration smoke | No | Integration surface is the visual gate runner. | Passed | `npm run dashboard:visual:docker` passed after projection provenance assertion was aligned with explicit projection labeling. |
| Selected detail smoke | Yes | The visual detail state must be backed by a responsive task-detail aggregate. | Passed | Built `dist` smoke confirmed selected T-0223 detail loads through task-scoped data without global status snapshot timeline work. |
