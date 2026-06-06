# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-recycle ... npm run test:focused -- tests/unit/task-finish.test.ts tests/unit/task-workbench.test.ts tests/unit/dev-docker-check.test.ts tests/unit/evidence-list.test.ts tests/unit/evidence-lint.test.ts` | Focused unit coverage for lifecycle/evidence/Docker changes. | Yes | Passed, 5 files / 43 tests. | 2026-06-06 local Docker output. |
| `docker exec hadara-recycle ... npm run test:focused -- tests/unit/dashboard-static.test.ts` | Verify dashboard route compatibility and cache expectations after workbench schema addition. | Yes | Passed, 1 file / 15 tests. | 2026-06-06 local Docker output. |
| `docker exec hadara-recycle ... npm run build && rm -rf /workspace/dist && cp -R dist /workspace/dist` | Typecheck and refresh workspace built CLI. | Yes | Passed. | 2026-06-06 local Docker output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI `task finish --task T-0274 --json` | Confirm direct lookup path works on mounted workspace. | Yes | Passed in dry-run; report returned in under 1 second. | 2026-06-06 built CLI output. |
| Built CLI `task status --task T-0274 --json` | Confirm additive readiness field appears in real workbench JSON. | Yes | Passed; `state.readiness.status=current-blocked`. | 2026-06-06 built CLI output. |
| Built CLI `dev docker-check --focused tests/unit/dev-docker-check.test.ts --json` | Confirm failed-step diagnostics are visible when sandbox blocks subprocess Docker. | Yes | Expected blocked under sandboxed Node subprocess; report exposed `stepId=temp-workspace`, `exitCode=1`, and omitted raw logs. | 2026-06-06 built CLI output. |
| Combined focused suite including dashboard-static in parallel | Probe prior dashboard timeout behavior. | Informational | One parallel worker run timed out in `dashboard-static`; standalone dashboard-static passed in 2.04s. | Recorded as worker contention, not route regression. |
