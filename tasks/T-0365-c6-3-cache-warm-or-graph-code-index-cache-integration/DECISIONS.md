# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Update the registered C6 detailed spec instead of creating a duplicate C6 spec file. | Accepted | `07_C6_Fast...` is already registered in SOP and docs registry as the detailed C6 implementation spec. | `docs/IMPLEMENTATION_SOP.md`; `.hadara/docs-registry.json` |
| D-2 | Treat Graphify as a source of performance patterns, not as HADARA's authority model. | Accepted | HADARA cache remains local, ignored, rebuildable, deterministic, and lower authority than project files. | `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` |
| D-3 | Move C6.3 to a source-manifest cache warm command before extractor shards/code-index cache integration. | Accepted | A narrow explicit warm command proves write boundaries and cache status behavior before broader read-path rewiring. | `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md`; `docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md` |
