# Files

| Path | Action | Reason |
|---|---|---|
| `src/schemas/smoke-evidence-summary.schema.json` | Add | Register reduced smoke evidence summary artifacts. |
| `src/schemas/release-artifact-manifest.schema.json` | Add | Register generated release artifact manifest files. |
| `src/schemas/schema-index.json` | Update | Add new schema fixture entries. |
| `src/core/schema.ts` | Update | Make the new schemas runtime-loadable. |
| `src/services/operational-debt.ts` | Update | Add read-only release evidence checks to release gate. |
| `tests/unit/operational-debt.test.ts` | Update | Cover evidence-backed release gate behavior and missing evidence issue codes. |
| `tests/unit/schema-runtime.test.ts` | Update | Cover the two new schema fixtures. |
| `tests/unit/schema-fixtures.test.ts` | Update | Expect the new schema ids. |
