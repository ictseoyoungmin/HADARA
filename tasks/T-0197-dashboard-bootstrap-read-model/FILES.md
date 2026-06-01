# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-bootstrap.ts` | Added | Implements `hadara.dashboard.bootstrap.v1` aggregate read model. | Done |
| `src/cli/dashboard.ts` | Updated | Adds read-only `/api/dashboard/bootstrap` route. | Done |
| `src/schemas/dashboard-bootstrap.schema.json` | Added | Registers bootstrap report fixture shape. | Done |
| `src/core/schema.ts` | Updated | Runtime schema registry imports bootstrap fixture. | Done |
| `src/schemas/schema-index.json` | Updated | Adds bootstrap schema index entry. | Done |
| `tests/unit/dashboard-bootstrap.test.ts` | Added | Covers aggregate shape, compact selected task, invalid selected task degradation, and schema validation. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Covers served bootstrap API route. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Adds bootstrap schema to expected fixture list. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Updated | Marks bootstrap route/report as implemented and cache disabled in T-0197. | Done |
| `docs/SCHEMAS.md` | Updated | Moves bootstrap schema from planned to fixture/current. | Done |
