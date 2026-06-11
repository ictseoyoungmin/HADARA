# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/docs-registry.ts` | Added | Document registry model, seed, list/doctor/explain reports, and drift checks. | Done |
| `src/cli/docs.ts` | Added | `hadara docs list/doctor/explain` command group. | Done |
| `src/cli/main.ts` | Updated | Lazy dispatch for docs command group. | Done |
| `src/cli/init.ts` | Updated | Fresh init registry/projection seed and profile upgrade registry merge. | Done |
| `src/services/capability-registry.ts` | Updated | Register docs command surfaces. | Done |
| `src/core/schema.ts`, `src/schemas/schema-index.json`, `src/schemas/docs-*.schema.json` | Updated | Register Phase 7.3 schemas. | Done |
| `tests/unit/docs-registry.test.ts`, `tests/unit/docs-doctor.test.ts` | Added | Focused Phase 7.3 behavior coverage. | Done |
| `tests/unit/init.test.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts` | Updated | Adjacent init/registry/schema coverage. | Done |
| `docs/SCHEMAS.md` | Updated | Human schema registry projection. | Done |
