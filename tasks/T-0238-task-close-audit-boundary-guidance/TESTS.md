# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/task-close.test.ts tests/unit/task-ready.test.ts tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-workflow-docs.test.ts | Validate close/audit guidance, adjacency consumers, schema fixtures, and workflow docs. | Yes | Passed: 5 files / 19 tests. | T-0238 evidence `ev:T-0238:ca2682cee08747c780cdf355`. |
| npm run dev:docker-sync-build | Run full Docker check, refresh `/workspace/dist`, and smoke built CLI version. | Yes | Passed: 92 files / 607 tests; built version smoke ok:true. | T-0238 evidence `ev:T-0238:7d6bf4c298134fc2a38bfec0`. |
| node dist/cli/main.js task close --task T-0238 --json | Built CLI close dry-run smoke before final close. | Yes | Passed twice: pre-close smoke exposed `lifecycle.model: validation-close-audit`; final dry-run passed with blockers 0. | T-0238 evidence `ev:T-0238:8d98861a28d347debd665ab6` and close evidence. |
| node dist/cli/main.js task audit-close --task T-0238 --json | Built CLI close audit smoke after execute. | Yes | Passed: final audit-close reported `auditVerdict.verdict: closed-valid`, report/source hash matches true, and `writeBoundary: read-only`. | T-0238 evidence `ev:T-0238:d2f4c828ce3945e3bdf74da8`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Write-boundary review | Yes | `task close --execute` must remain bounded to close evidence append and `task audit-close` must remain read-only. | Passed | Implementation adds report metadata only; execute still calls existing close evidence append path and audit reports `writeBoundary: read-only`. |
| Security smoke | No | No permission, secret, storage, or execution boundary change. | Not Run | Not applicable. |
| Integration smoke | No | No MCP, provider, dashboard, or TUI runtime surface change. | Not Run | Not applicable. |
