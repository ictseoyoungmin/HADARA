# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/evidence/evidence.ts` | Modify | Add append result metadata, local lock, explicit-key dedupe, and lock timeout error. | Modified |
| `src/cli/evidence-json.ts` | Modify | Return append result directly and surface lock/policy failures in JSON. | Modified |
| `src/cli/evidence.ts` | Modify | Parse and pass `--idempotency-key` for evidence writes. | Modified |
| `src/cli/main.ts` | Modify | Show idempotency option in top-level usage. | Modified |
| `tests/unit/evidence-json.test.ts` | Modify | Cover explicit-key dedupe and keyless append-only behavior. | Modified |
| `README.md` | Modify | Keep standard workflow example current. | Modified |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Modify | Document the new optional evidence idempotency key. | Modified |
| `docs/IMPLEMENTATION_SOP.md` | Modify | Keep standard workflow examples current. | Modified |
| `docs/CLI_JSON_CONTRACT.md` | Modify | Document evidence collect response append metadata and keyed no-op behavior. | Modified |
| `src/cli/init.ts` | Modify | Keep generated project docs current. | Modified |
| `tests/unit/init.test.ts` | Modify | Update generated-doc and README expectations, including stale rc.2 release wording assertion. | Modified |
| `tests/unit/task-workflow-docs.test.ts` | Modify | Update standard-loop command and semantics assertions for optional idempotency keys. | Modified |
| `dist/` | Refresh | Sync built CLI output from the successful `/tmp` validation build. | Modified |
