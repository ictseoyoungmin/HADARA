# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Projection visual/a11y gate covers projection-first routes and required dashboard states. | Done | `dashboard/visual-check.mjs` stubs core, timeline, debt, projection status, task detail, bootstrap, offline, and degraded reads; screenshots are named for projection-ready/detail/stale/refreshing/missing/offline/degraded. |
| AC-2 | Projection fixtures are committed, schema-gated, and redacted. | Done | `dashboard/visual-fixtures/*.json` added; static test and Node parse/redaction check verify schemas and absence of raw project-root strings. |
| AC-3 | Regression tests or executable constraints are recorded. | Done | `tests/unit/dashboard-static.test.ts` pins route/state/fixture coverage; `git diff --check`, `node --check dashboard/visual-check.mjs`, and fixture parse/redaction checks passed. |
| AC-4 | Environment-blocked validation is explicitly carried forward. | Done | Host Vitest, dashboard build, and Docker visual gate failures are recorded in TESTS/RISKS and AGENT_HANDOFF. |
| AC-5 | Public evidence and handoff are updated. | Done | `evidence add-command` attached; capsule and project handoff updated before close. |
