# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Cache status/warm reports include additive diagnostics for operator action. | Met | `src/context/context-cache-store.ts` |
| AC-2 | Diagnostics distinguish fresh, missing, stale, corrupt, and partial states. | Met | `tests/unit/context-cache-store.test.ts` |
| AC-3 | Diagnostics include structured warm command args and shard summaries. | Met | `recommendedCommandArgs`, `shardSummary.plannedShardKeys` |
| AC-4 | Schema fixtures allow the additive diagnostics shape. | Met | `src/schemas/context-cache-status.schema.json`, `src/schemas/context-cache-warm.schema.json` |
| AC-5 | Validation evidence is attached. | Met | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
| AC-6 | Handoff/shared state routes T-0385 next. | Met | Shared docs updated before close. |
