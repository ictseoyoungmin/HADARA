# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read 0.4 docs registry/register requirements and current docs-registry surfaces. | Done | T-04A4 spec readings and existing service/CLI/tests reviewed. |
| 2 | Add registry-first `docs register` service and CLI handling. | Done | `src/services/docs-registry.ts`, `src/cli/docs.ts` |
| 3 | Register schema and command metadata. | Done | `src/schemas/docs-register.schema.json`, command registry, schema index |
| 4 | Add focused tests for seed expectations, dry-run/execute registration, schema, and command inventory. | Done | `ev:T-0430:1933b10f80184f8abb9540cb` |
| 5 | Refresh built `dist` and run built CLI smoke. | Done | `ev:T-0430:1933b10f80184f8abb9540cb` |
