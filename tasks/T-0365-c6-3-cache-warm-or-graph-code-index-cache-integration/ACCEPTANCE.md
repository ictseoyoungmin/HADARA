# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | C6 spec documents a speed-first design for cold graph creation, warm cache reads, shard invalidation, and first-build optimization. | Done | `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`; `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| AC-2 | C6 spec compares Graphify-inspired techniques with HADARA-specific boundaries and records what is adopted or rejected. | Done | `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`; `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| AC-3 | C6 spec lists existing code areas that need changes for cache warm, graph/code-index cache integration, and context pack warm paths. | Done | `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md`; `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| AC-4 | Docs-only validation is run and recorded. | Done | `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
| AC-5 | Handoff and task-local evidence summary are updated. | Done | `tasks/T-0365-c6-3-cache-warm-or-graph-code-index-cache-integration/HANDOFF.md`; `docs/AGENT_HANDOFF.md`; `ev:T-0365:31c8a5a12de74b5ca975e2ac` |
