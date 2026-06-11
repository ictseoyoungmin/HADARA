# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | AC-7.3-1/2: fresh basic/standard/governed init creates `.hadara/docs-registry.json` seeded to generated docs. | Met | `tests/unit/docs-registry.test.ts`, `tests/unit/init.test.ts` |
| AC-2 | AC-7.3-3: `docs list`, `docs doctor`, and `docs explain` return schema-valid JSON. | Met | `tests/unit/docs-registry.test.ts`, `tests/unit/docs-doctor.test.ts`, built CLI smoke |
| AC-3 | AC-7.3-4: missing registry produces warning and inferred view, not crash. | Met | `tests/unit/docs-registry.test.ts` |
| AC-4 | AC-7.3-5: docs doctor detects missing registered files, unregistered required reading, canonical conflicts, and invalid statuses. | Met | `tests/unit/docs-doctor.test.ts` |
| AC-5 | AC-7.3-6: init doctor and docs doctor boundaries are non-conflicting. | Met | `tests/unit/init.test.ts`, `tests/unit/docs-doctor.test.ts` |
| AC-6 | AC-7.3-7: new schemas are registered. | Met | `tests/unit/schema-fixtures.test.ts` |
