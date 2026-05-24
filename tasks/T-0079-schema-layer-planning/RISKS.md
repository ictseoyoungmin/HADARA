# Risks

| Risk | Mitigation |
|---|---|
| Schemas accidentally become stricter than current read model contracts. | Keep initial schemas focused on required envelope fields and allow additive properties. |
| Registry duplicates runtime logic before schema loader exists. | Treat `schema-index.json` as a fixture/contract source only; defer `src/core/schema.ts`. |
| Schema ids drift from `schemaVersion` values. | Add tests that verify index ids match schema metadata and `properties.schemaVersion.const`. |
