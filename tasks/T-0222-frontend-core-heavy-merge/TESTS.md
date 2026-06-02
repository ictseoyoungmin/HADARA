# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-static.test.ts` | Run focused frontend/static source tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dashboard:build:docker` | Rebuild static dashboard bundle through Docker. | Yes | Passed: `docs/design/dashboard/index.html` rebuilt; bundle reports JS 40.2 kB, CSS 17.0 kB, total 60.2 kB. | Command output observed 2026-06-02 after follow-up. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 585 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after task-detail/table parsing follow-up. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command exited 0 after follow-up. |
| `node --input-type=module -e "...task-detail/core smoke..."` | Check selected-capsule detail latency and handoff table parsing through built `dist`. | Yes | Passed: T-0223 detail returned `statusCode:200`, `ok:true`, `closeState:closed-valid` in 1852 ms; handoff summaries expose data rows instead of Markdown table headers. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Browser storage scan | Yes | Frontend must remain memory-only. | Passed in Docker sync-build and dashboard visual gate. | `tests/unit/dashboard-static.test.ts`; `dashboard/visual-check.mjs`. |
| Bundle refresh | Yes | Served HTML must reflect authored source. | Passed: Docker dashboard build refreshed served HTML and route string check found projection core/timeline/debt routes. | `docs/design/dashboard/index.html`. |
| Selected task detail smoke | Yes | Capsule detail must not block behind global workbench/timeline reads. | Passed: task detail uses a selected-task fast workbench and task-scoped timeline without global status snapshot work. | Built `dist` smoke for `/api/dashboard/task-detail?taskId=T-0223`. |
