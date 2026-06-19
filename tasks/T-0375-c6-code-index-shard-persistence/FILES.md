# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-cache-store.ts` | Edited | Added code-index shard path, record read/write helpers, schema validation, and warm execute item. | Done |
| `src/context/code-index.ts` | Inspected | Existing `CodeIndexReport` already carries cache metadata and schema shape; no source change required. | Done |
| `src/context/code-graph-extractor.ts` | Inspected | Existing `codeIndexReportToGraphExtraction` converts cached reports without live rebuild; no source change required. | Done |
| `src/context/context-graph-builder.ts` | Edited | Routed include-code graph collection through fresh code-index shard, with live fallback metadata. | Done |
| `tests/unit/code-index.test.ts` | Inspected | Existing code-index coverage included in focused validation. | Done |
| `tests/unit/context-cache-store.test.ts` | Edited | Added warm execute shard, fresh read, cache metadata, and stale invalidation assertions. | Done |
| `tests/unit/context-graph-builder.test.ts` | Edited | Added include-code code-index cache hit/no-write and stale fallback coverage. | Done |
| `tests/unit/context-graph-cli.test.ts` | Edited | Updated cache warm CLI expectation for `code-index.json`. | Done |
| `dist/` | Generated | Refreshed built CLI output from Docker build. | Done |
