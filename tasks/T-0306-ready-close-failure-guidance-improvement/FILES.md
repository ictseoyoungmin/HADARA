# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/harness/validate.ts` | Modify | Add shared remediation hint fields to harness issues. | Done |
| `src/task/task-close.ts` | Modify | Preserve hint fields when close prefixes harness/evidence/protocol issues. | Done |
| `src/task/task-ready.ts` | Inspect | Ready reports consume close issues without extra code changes. | Done |
| `src/schemas/harness-validate.schema.json` | Add | Register harness validation schema fixture with hint fields. | Done |
| `src/schemas/task-ready.schema.json` and `src/schemas/task-close.schema.json` | Modify | Document additive issue hint fields. | Done |
| `src/core/schema.ts` and `src/schemas/schema-index.json` | Modify | Register harness validation schema fixture. | Done |
| `tests/unit/task-ready.test.ts` | Modify | Assert ready exposes hints. | Done |
| `tests/unit/task-close.test.ts` | Modify | Assert close exposes hints. | Done |
| `tests/harness/harness-validate.test.ts` | Modify | Assert harness exposes hints. | Done |
| `tests/unit/schema-fixtures.test.ts` and `tests/unit/schema-runtime.test.ts` | Modify | Keep schema fixture coverage aligned. | Done |
| `dist/` | Refresh | Keep built CLI current after TypeScript changes. | Done |
| Task Capsule docs | Modify | Track scope, validation, acceptance, and handoff. | In Progress |
