# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/docs-registry.ts` | Modify | Add registry-first docs registration report and writer. | Done |
| `src/cli/docs.ts` | Modify | Route `hadara docs register` flags to the service. | Done |
| `src/services/capability-registry.ts` | Modify | Add command registry metadata for `docs.register`. | Done |
| `src/core/schema.ts` | Modify | Register the new docs-register schema fixture. | Done |
| `src/schemas/docs-register.schema.json` | Add | Define `hadara.docs.register.v1` report shape. | Done |
| `src/schemas/schema-index.json` | Modify | Add schema index entry. | Done |
| `docs/SCHEMAS.md` | Modify | Document the new schema fixture. | Done |
| `tests/unit/docs-registry.test.ts` | Modify | Cover current 0.4 seed expectations and register dry-run/execute behavior. | Done |
| `tests/unit/command-registry.test.ts` | Modify | Require command inventory coverage for `docs.register`. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modify | Require schema-index coverage for `hadara.docs.register.v1`. | Done |
| `dist/` | Refresh | Sync built CLI output from Docker validation build. | Done |
| `tasks/T-0430-t-04a4-docs-registry-storage-and-register-surface/*` | Modify | Complete capsule docs and evidence. | Done |
