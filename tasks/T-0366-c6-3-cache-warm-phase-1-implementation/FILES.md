# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-cache-store.ts` | Update | Add cache warm report builder/types over source-manifest cache. | Done |
| `src/context/source-manifest.ts` | Update | Use git candidate enumeration before filesystem fallback for faster source-manifest discovery. | Done |
| `src/cli/context.ts` | Update | Route `context cache warm [--execute] --json`. | Done |
| `src/schemas/context-cache-warm.schema.json` | Add | Public JSON schema for warm report. | Done |
| `src/core/schema.ts` | Update | Register `hadara.context.cacheWarm.v1`. | Done |
| `src/schemas/schema-index.json` | Update | Index cache warm schema. | Done |
| `src/services/capability-registry.ts` | Update | Register `context.cache.warm`. | Done |
| `docs/COMMAND_SURFACE.md` | Update | Document warm command write boundary. | Done |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document warm JSON contract and `ok` semantics. | Done |
| `docs/SCHEMAS.md` | Update | Document cache warm schema. | Done |
| `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` | Update | Record phase 1 implementation status, optimization, and residual performance risk. | Done |
| `tests/unit/context-cache-store.test.ts` | Update | Cover dry-run, execute, stale/corrupt repair. | Done |
| `tests/unit/context-graph-cli.test.ts` | Update | Cover CLI warm dry-run/execute. | Done |
| `tests/unit/schema-fixtures.test.ts` | Update | Include new schema fixture. | Done |
| `tests/unit/schema-runtime.test.ts` | Review | Existing runtime schema test pattern did not require an explicit warm sample. | Not Needed |
| `tests/unit/command-registry.test.ts` | Update | Include command metadata. | Done |
