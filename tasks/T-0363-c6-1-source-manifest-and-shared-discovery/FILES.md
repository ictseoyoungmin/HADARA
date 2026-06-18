# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/context/source-manifest.ts` | Added | C6.1 metadata-first source manifest builder, classifier, comparison, and subset-hash helpers. | Done |
| `src/schemas/context-source-manifest.schema.json` | Added | JSON schema fixture for `hadara.context.sourceManifest.v1`. | Done |
| `src/core/schema.ts` | Updated | Runtime schema registry now exposes the source manifest schema. | Done |
| `src/schemas/schema-index.json` | Updated | Schema index includes the source manifest fixture metadata. | Done |
| `tests/unit/context-source-manifest.test.ts` | Added | Focused coverage for discovery, ignore boundaries, carry-forward hashes, comparison, budgets, and extractor keys. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Expected schema id list includes `hadara.context.sourceManifest.v1`. | Done |
| `docs/SCHEMAS.md` | Updated | Documents the new schema and corrects C3 public-CLI status. | Done |
| `docs/PROJECT_STATE.md` | Updated | Records T-0363 result and C6.2 next route. | Done |
| `docs/AGENT_HANDOFF.md` | Updated | Current handoff points to C6.2 after T-0363. | Done |
| `docs/DEVELOPMENT_SLICES.md` | Updated | Adds C6.1 done row. | Done |
| `docs/TASK_BOARD.md` | Updated | T-0363 status/notes managed by task finish. | Done |
| `tasks/T-0363-c6-1-source-manifest-and-shared-discovery/*` | Updated | Capsule evidence, decisions, risks, tests, and handoff. | Done |
