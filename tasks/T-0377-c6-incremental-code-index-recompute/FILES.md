# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/code-index.ts` | Edited | Added per-file summary extraction, local file-summary cache records, metadata-based freshness, corrupt/schema mismatch diagnostics, and report cache counters while preserving `hadara.codeIndex.v1` output shape. | Done |
| `src/context/context-cache-store.ts` | Edited | Integrated per-file summary cache read/write only in explicit code-index warm execute and surfaced file-summary counters on the warm item. | Done |
| `src/context/source-manifest.ts` | Edited | Reused exported `CODE_INDEX_EXTRACTOR_VERSION` for manifest extractor-version alignment. | Done |
| `src/context/context-graph.ts` | Edited | Extended cache metadata with optional per-file summary cache counters. | Done |
| `src/context/context-graph-builder.ts` | Inspected | Include-code read path already consumes merged code-index shard or falls back live without per-file writes; no edit needed. | Done |
| `src/schemas/code-index.schema.json` | Edited | Registered file-summary cache diagnostic issue codes for schema-valid degraded reports. | Done |
| `tests/unit/code-index.test.ts` | Edited | Covered per-file summary reuse, changed-file recompute, corrupt cache fallback, cache counters, and schema validity. | Done |
| `tests/unit/context-cache-store.test.ts` | Edited | Covered explicit warm execute using per-file summaries and reusing unchanged summaries after a code source change. | Done |
| `tests/unit/context-graph-builder.test.ts` | Inspected | Existing no-write/read fallback coverage remains in full suite; no edit needed. | Done |
