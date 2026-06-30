# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/docs-registry.ts` | Modify | Add read-map/inbox report builders and derived metadata axes. | Done |
| `src/cli/docs.ts` | Modify | Route `docs read-map` and `docs inbox`. | Done |
| `src/services/capability-registry.ts` | Modify | Add command registry metadata for new docs surfaces. | Done |
| `src/core/schema.ts` | Modify | Register new schema fixtures. | Done |
| `src/schemas/docs-read-map.schema.json` | Add | Define `hadara.docs.readMap.v1`. | Done |
| `src/schemas/docs-inbox.schema.json` | Add | Define `hadara.docs.inbox.v1`. | Done |
| `src/schemas/schema-index.json` | Modify | Add schema index entries. | Done |
| `docs/SCHEMAS.md` | Modify | Document new schema fixtures. | Done |
| `tests/unit/docs-registry.test.ts` | Modify | Cover read-map classification and inbox attention items. | Done |
| `tests/unit/command-registry.test.ts` | Modify | Require command registry coverage. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modify | Require schema index coverage. | Done |
| `dist/` | Refresh | Sync built CLI output from Docker validation build. | Done |
