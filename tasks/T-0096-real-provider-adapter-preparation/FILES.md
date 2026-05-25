# Files

| Path | Action | Reason |
|---|---|---|
| `src/providers/provider-preparation.ts` | Added | Defines provider config normalization and provider call report helpers without network calls or secret loading. |
| `src/schemas/provider-config.schema.json` | Added | Registers the provider config contract as `hadara.provider.config.v1`. |
| `src/schemas/provider-call.schema.json` | Added | Registers the provider call summary contract as `hadara.provider.call.v1`. |
| `src/core/schema.ts` | Updated | Makes the new provider schemas runtime-loadable. |
| `src/schemas/schema-index.json` | Updated | Adds provider config/call schema fixtures to the schema registry. |
| `src/index.ts` | Updated | Exports provider preparation helpers. |
| `tests/contract/provider-preparation.test.ts` | Added | Covers config normalization, secret rejection, no content leakage, redaction, and schema validity. |
| `tests/unit/schema-fixtures.test.ts` | Updated | Keeps schema index fixture coverage aligned with new provider schemas. |
| `tests/unit/schema-runtime.test.ts` | Updated | Adds runtime validation coverage for provider config and call fixtures. |
| `tasks/T-0096-real-provider-adapter-preparation/*` | Updated | Records scope, constraints, evidence, and handoff for this capsule. |
