# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/context-cache-store.ts` | Edited | Added graph-core shard path, build/write/read helpers, cache warm planning/execution item, and payload validation. | Done |
| `src/context/context-graph-builder.ts` | Edited | `context graph` now consumes a fresh graph-core shard read-only before falling back to live extraction. | Done |
| `src/context/context-pack.ts` | Inspected | Existing pack builder already delegates to `buildContextGraphReport`, so no direct edit was needed for graph-core reuse. | Done |
| `tests/unit/context-cache-store.test.ts` | Edited | Added graph-core warm/read no-write regression coverage. | Done |
| `tests/unit/context-pack.test.ts` | Edited | Added live context-pack warm-path regression coverage. | Done |
| `tests/unit/context-graph-cli.test.ts` | Edited | Updated cache warm execute smoke expectation for graph-core shard output. | Done |
