# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm ci && npm run build && npx vitest run (Docker node:22-bookworm) | Full type build + test suite. | Yes | Passed: 84 files / 562 tests. | evidence.jsonl |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| bash scripts/dashboard-visual-check.sh (Playwright + axe-core, Docker) | Yes | Visual baselines + accessibility for the rebuilt surface. | Passed: home/detail/empty/degraded, no critical/serious a11y. | evidence.jsonl |
| Host dashboard serve smoke | No | Confirm served bundle + live bootstrap API. | Passed: `dashboard serve` returned 200 for /dashboard/ and /api/dashboard/bootstrap with the Phase 5.6 bundle. | evidence.jsonl |
