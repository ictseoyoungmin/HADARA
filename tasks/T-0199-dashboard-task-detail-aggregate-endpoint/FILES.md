# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-task-detail.ts` | Added | Implements selected-task dashboard detail aggregate. | Done |
| `src/cli/dashboard.ts` | Updated | Adds `/api/dashboard/task-detail?taskId=` route. | Done |
| `src/schemas/dashboard-task-detail.schema.json` | Added | Registers task-detail aggregate schema fixture. | Done |
| `src/core/schema.ts` | Updated | Adds runtime schema registration. | Done |
| `src/schemas/schema-index.json` | Updated | Adds schema index entry. | Done |
| `docs/design/dashboard/index.html` | Updated | Selected-task detail now reads the aggregate route only. | Done |
| `tests/unit/dashboard-task-detail.test.ts` | Added | Covers aggregate report, proof fields, missing task degradation, and schema validation. | Done |
| `tests/unit/dashboard-static.test.ts` | Updated | Covers route, missing taskId, and frontend fan-out removal. | Done |
| `tests/unit/schema-fixtures.test.ts` | Updated | Adds task-detail schema to fixture allowlist. | Done |
| `docs/SCHEMAS.md` | Updated | Marks task-detail schema as fixture/current. | Done |
