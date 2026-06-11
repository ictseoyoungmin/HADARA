# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/managed-sections.ts` | Added | Managed marker parser, inspection reports, patch plan, and hash-guarded apply behavior. | Done |
| `src/cli/docs.ts` | Updated | Added `docs managed list/explain` and `docs patch` command handling. | Done |
| `src/cli/init.ts` | Updated | Fresh init safe generated docs now include managed markers. | Done |
| `src/task/task-capsule.ts`, `src/task/task-templates.ts` | Updated | Fresh Task Capsule TASK/HANDOFF markers and marker-aware Task Board row insert. | Done |
| `src/services/capability-registry.ts` | Updated | Registered new docs managed/patch command surfaces. | Done |
| `src/core/schema.ts`, `src/schemas/schema-index.json`, `src/schemas/docs-patch-plan.schema.json` | Updated | Registered Phase 7.4 patch plan schema. | Done |
| `tests/unit/managed-sections.test.ts`, `tests/unit/docs-patch.test.ts` | Added | Focused parser, init marker, dry-run, execute, and hash mismatch coverage. | Done |
| `tests/unit/init.test.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts` | Updated | Adjacent marker/schema/registry coverage. | Done |
| `docs/SCHEMAS.md` | Updated | Human schema registry projection. | Done |
