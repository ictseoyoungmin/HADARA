# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Duplicate or conflicting `hadara.stateProjection.v1` contract changes could break existing Phase 8 state projection consumers. | Existing tests and CLI surfaces could regress before C1 state implementation is ready. | Medium | Left existing state projection schema/service intact in this capsule; context graph owns a nested projection report shape for C1 and implementation alignment is deferred. | Mitigated; carry forward to the state projection capsule. |
| Schema fixtures without runtime loader registration can pass manual review but fail consumers. | `loadSchema()` would reject new schema ids. | Medium | Updated `src/core/schema.ts`, schema index, and focused schema tests together. | Mitigated. |
