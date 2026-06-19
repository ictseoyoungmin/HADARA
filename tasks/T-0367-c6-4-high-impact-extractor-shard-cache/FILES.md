# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/context/context-cache-store.ts | Modify | Add graph extractor shard keys, record write/read validation, warm shard planning, and warm report metadata. | Complete |
| src/context/context-graph-builder.ts | Modify | Read fresh high-impact extractor shards on graph build and fall back to live extraction. | Complete |
| src/context/context-graph.ts | Modify | Add optional shard cache metadata fields. | Complete |
| src/context/context-graph-shard-cache.ts | Not Added | Shard helpers stayed in `context-cache-store.ts` to avoid a cache-store import cycle. | Closed |
| src/schemas/context-cache-warm.schema.json | Modify | Document additive warm shard planning/execution metadata. | Complete |
| src/schemas/context-graph.schema.json | Modify | Document additive cache metadata for shard hits/misses. | Complete |
| tests/unit/context-cache-store.test.ts | Modify | Cover warm shard writes and subset invalidation behavior. | Complete |
| tests/unit/context-graph-cli.test.ts | Modify | Cover CLI read-only graph shard consumption. | Complete |
| tests/unit/context-graph-builder.test.ts | Not Modified | Existing builder integration coverage passed without new assertions. | Closed |
| docs/PROJECT_STATE.md | Modify | Record active/completed task state. | Complete |
| docs/AGENT_HANDOFF.md | Modify | Record next-step handoff and validation status. | Complete |
| docs/DEVELOPMENT_SLICES.md | Modify | Record T-0367 slice outcome. | Complete |
