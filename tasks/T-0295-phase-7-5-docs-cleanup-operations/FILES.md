# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/docs-cleanup.ts` | Added | Implements registry-only mark, dry-run archive planning, and effective required-reading reports. | Done |
| `src/cli/docs.ts` | Updated | Adds `docs mark`, `docs archive`, and `docs required-reading` dispatch. | Done |
| `src/services/docs-registry.ts` | Updated | Adds cleanup-oriented doctor warnings/errors for stale required reading, missing superseded targets, and archive candidates. | Done |
| `src/services/capability-registry.ts` | Updated | Registers new docs cleanup command surfaces. | Done |
| `src/core/schema.ts` | Updated | Registers new cleanup schema fixtures. | Done |
| `src/schemas/docs-mark.schema.json` | Added | Documents `hadara.docs.mark.v1`. | Done |
| `src/schemas/docs-archive-plan.schema.json` | Added | Documents `hadara.docs.archivePlan.v1`. | Done |
| `src/schemas/docs-required-reading.schema.json` | Added | Documents `hadara.docs.requiredReading.v1`. | Done |
| `src/schemas/schema-index.json` | Updated | Adds Phase 7.5 schema fixture entries. | Done |
| `docs/SCHEMAS.md` | Updated | Documents Phase 7.5 cleanup schemas. | Done |
| `tests/unit/docs-mark.test.ts` | Added | Covers dry-run impact, hash-guarded execute, invalid transitions, canonical guard, and missing target. | Done |
| `tests/unit/docs-archive.test.ts` | Added | Covers dry-run candidates, risk references, and no file moves. | Done |
| `tests/unit/docs-required-reading.test.ts` | Added | Covers exclusion of historical/superseded/archived required-reading docs. | Done |
| `tests/unit/docs-doctor.test.ts` | Updated | Covers stale required reading and missing superseded target diagnostics. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Adds new schema ids to fixture registry test. | Done |
| `tests/unit/command-registry.test.ts` | Updated | Requires new public docs cleanup command ids. | Done |
