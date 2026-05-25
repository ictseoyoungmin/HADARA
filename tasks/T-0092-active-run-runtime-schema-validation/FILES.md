# Files

| Path | Action | Reason |
|---|---|---|
| `src/core/schema.ts` | Add | Lightweight registered JSON Schema loader/validator for the current fixture subset. |
| `src/services/active-run-state.ts` | Modify | Validate active-run projection/resume reports before returning them. |
| `tests/unit/schema-runtime.test.ts` | Add | Cover runtime schema validator behavior for valid/degraded/invalid active-run reports. |
| `tests/unit/active-run-state.test.ts` | Modify | Assert malformed local state degrades to a schema-valid active-run projection/resume report. |
| `tasks/T-0092-active-run-runtime-schema-validation/*` | Modify | Keep Task Capsule scope, evidence, and handoff current. |
