# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep this capsule contract-only: add types and schemas, but no extractor, ranking, cache, or CLI surface. | Accepted | The worker plan separates C1 schema/types from extractor and command implementation; limiting this capsule keeps the public contract reviewable. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| D-2 | Do not replace the existing Phase 8 `hadara.stateProjection.v1` service/schema in T-0343. | Accepted | The current implementation already serves existing state consistency consumers; C1 state projection compatibility should be handled in a dedicated capsule. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
| D-3 | Register both new schemas immediately in the runtime loader and schema index. | Accepted | Later extractor/CLI work can rely on `validateSchema` and schema registry alignment instead of carrying local-only fixtures. | `ev:T-0343:52220ea996ec416ab6d508fc`. |
