# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-cache-store.ts` | Add | Cache record envelope, schema guard, read/write helpers, and status report builder. | Done |
| `src/context/source-manifest.ts` | Update | Make `manifestHash` stable across `generatedAt` and caller command so cache status can hit. | Done |
| `src/cli/context.ts` | Update | Add read-only `context cache status --json` command routing. | Done |
| `src/schemas/context-cache-record.schema.json` | Add | Fixture schema for common C6 cache record envelope. | Done |
| `src/schemas/context-cache-status.schema.json` | Add | Fixture schema for read-only cache status reports. | Done |
| `src/core/schema.ts` | Update | Register new C6 schemas. | Done |
| `src/schemas/schema-index.json` | Update | Document new schema fixtures. | Done |
| `src/services/capability-registry.ts` | Update | Register `context.cache.status` command metadata. | Done |
| `tests/unit/context-cache-store.test.ts` | Add | Store/status unit coverage. | Done |
| `tests/unit/context-source-manifest.test.ts` | Update | Lock manifest hash stability needed for cache hits. | Done |
| `tests/unit/context-graph-cli.test.ts` | Update | CLI status/no-write coverage. | Done |
| `tests/unit/command-registry.test.ts` | Update | Registry coverage for `context.cache.status`. | Done |
| `tests/unit/schema-fixtures.test.ts` | Update | Schema index coverage for C6 cache schemas. | Done |
