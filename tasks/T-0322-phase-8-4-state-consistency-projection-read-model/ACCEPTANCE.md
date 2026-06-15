# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Projection report is read-only and has no execute/repair behavior. | Done | `src/services/state-projection.ts`; tests snapshot project files before/after report generation. |
| AC-2 | Projection includes source paths and extracted values for core state artifacts. | Done | `hadara.stateProjection.v1` report includes source summaries, task projections, close proof state, and issues. |
| AC-3 | Clean fixture reports consistent; drift fixtures emit expected issue codes with path and fixHint. | Done | `tests/unit/state-projection.test.ts`; focused Docker validation. |
| AC-4 | Missing optional sources degrade with warnings, not crashes. | Done | Missing-source projection fixture test. |
| AC-5 | Schema fixture is registered and tests pass. | Done | `src/schemas/state-projection.schema.json`, schema index, runtime schema loader, schema-fixtures test. |
| AC-6 | Evidence is attached and shared handoff routes Phase 8.5. | Done | T-0322 evidence records and shared state docs. |
