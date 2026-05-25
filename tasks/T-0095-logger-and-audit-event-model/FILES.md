# Files

| Path | Action | Reason |
|---|---|---|
| `src/core/events.ts` | Add | Define `hadara.event.v1` helpers. |
| `src/core/audit.ts` | Update | Route audit writes through structured event normalization while preserving compatibility fields. |
| `src/schemas/event.schema.json` | Add | Document the event fixture schema. |
| `src/schemas/schema-index.json` | Update | Register `hadara.event.v1`. |
| `src/core/schema.ts` | Update | Load the event schema fixture. |
| `tests/unit/events.test.ts` | Add | Cover event normalization, redaction, and audit compatibility. |
| `tests/unit/schema-fixtures.test.ts` | Update | Include the new schema fixture in index expectations. |
| `tests/unit/schema-runtime.test.ts` | Update | Cover runtime validation for a sample event. |
