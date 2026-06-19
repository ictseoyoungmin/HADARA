# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement C6.3 phase 1 as source-manifest-only cache warm. | Accepted | This gives an explicit write surface and proves status hit/stale behavior before broader shard writes. | `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` |
| D-2 | Add a distinct `hadara.context.cacheWarm.v1` schema instead of reusing cache status. | Accepted | Warm has dry-run/execute write-plan semantics that differ from read-only status. | `src/schemas/context-cache-warm.schema.json` |
| D-3 | Add safe git candidate enumeration before filesystem fallback. | Accepted | Avoids walking generated/local ignored trees before source classification while preserving stat-based freshness checks. | `src/context/source-manifest.ts` |
